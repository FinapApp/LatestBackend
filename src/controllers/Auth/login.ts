import { Request, Response } from "express";
import { validateLogin } from "../../validators/validators";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { handleResponse, errors } from "../../utils/responseCodec";
import { config } from "../../config/generalconfig";
import { USER } from "../../models/User/user.model";
import { SESSION } from "../../models/User/userSession.model";
import { fetchIpGeolocation } from "../../utils/IP_helpers";
import useragent from "useragent";
import bcrypt from "bcryptjs";
import { USERPREFERENCE } from "../../models/User/userPreference.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { getIndex } from "../../config/melllisearch/mellisearch.config";
import { sendTwoFactorCodeEmail } from "../../utils/sendTwoFactorCodeEmail";
import { generateNumericOTP } from "../../utils/OTPGenerator";
import { sendTwoFactorCodePhone } from "../../utils/sendTwoFactorCodePhone";
import { redis } from "../../config/redis/redis.config";
import { WALLET } from "../../models/Wallet/wallet.model";
// import { sendBulkNotificationKafka } from "../../utils/sendNotificationKafka";

interface LoginRequest {
  email?: string;
  username?: string;
  phone?: string;
  password: string;
  fcmToken: string;
}

interface UserPreference {
  _id: string;
  theme: 'dark' | 'light' | 'system';
  textSize: 'small' | 'medium' | 'large';
  nightMode: boolean;
  twoFactor: boolean;
  twoFactorMethod: 'sms' | 'email';
}

export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationError: Joi.ValidationError | undefined = validateLogin(req.body);
    if (validationError) {
      return handleResponse(res, 400, errors.validation, validationError.details);
    }

    const { username, email, phone, password, fcmToken } = req.body as LoginRequest;

    // Find user by email/username/phone
    const query: Record<string, string> = {}
    if (email) query.email = email;
    else if (username) query.username = username;
    else if (phone) query.phone = phone;

    const checkUser = await USER.findOne(query)
    if (!checkUser) {
      return handleResponse(res, 400, errors.invalid_credentials);
    }

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, checkUser.password);
    if (!passwordMatch) {
      return handleResponse(res, 400, errors.invalid_credentials);
    }

    const userId = checkUser._id;
    const checkUserPreference = await USERPREFERENCE.findById(userId, "theme textSize nightMode twoFactor twoFactorMethod -_id") as UserPreference;
    const checkPreferences = checkUserPreference?.twoFactor;

    if (checkPreferences) {
      let OTP = generateNumericOTP();
      if (checkUserPreference?.twoFactorMethod == "email") {
        await Promise.all([
          sendTwoFactorCodeEmail(OTP, checkUser.email as string, checkUser.username as string),
          redis.set(`2FA-OTP:${email}`, JSON.stringify({ OTP }), "EX", config.REDIS_EXPIRE_IN)
        ])
        return handleResponse(res, 200, { fcmToken, type: "email", email: checkUser.email });
      } else {
        await Promise.all([
          sendTwoFactorCodePhone(OTP, checkUser.phone as string),
          redis.set(`2FA-OTP:${phone}`, JSON.stringify({ OTP }), "EX", config.REDIS_EXPIRE_IN)
        ])
        return handleResponse(res, 200, { fcmToken, type: "phone", phone: checkUser.phone });
      }
    }

    // Session management with notification data
    const checkSession = await SESSION.find({ user: userId }, "_id fcmToken device os location", {
      sort: { createdAt: 1 },
    });

    // let loggedOutSession = null;
    if (checkSession && checkSession.length >= config.MAX_LOGIN_SESSION) {
      // loggedOutSession = checkSession[0];
      await SESSION.findByIdAndDelete(checkSession[0]._id);
    }

    // Fetch IP and device data
    const IP = req.headers['x-forwarded-for'] || ""
    let geoData: any = await fetchIpGeolocation(IP as string)
    const deviceData = useragent.parse(req.headers["user-agent"]);

    // Generate tokens
    const refreshToken = jwt.sign(
      { userId },
      config.JWT.REFRESH_TOKEN_SECRET as string
    );

    // Save session
    const sessionData: any = {
      user: userId,
      refreshToken,
      fcmToken,
      ip: IP,
      device: deviceData.toAgent(),
      os: deviceData.os.toString(),
    };

    // Conditionally add geo-related fields
    if (geoData) {
      sessionData.gps = {
        type: "Point",
        coordinates: [geoData.longitude, geoData.latitude],
      };
      sessionData.location = `${geoData.zipcode} ${geoData.city}, ${geoData.state_prov} ${geoData.country_name} ${geoData.continent_name}`;
    }

    const session = await SESSION.create(sessionData);

    if (checkUser.isDeactivated) {
      checkUser.isDeactivated = false;
      (checkUser as any).save();
      const userIndex = getIndex("USERS");
      await userIndex.addDocuments([
        {
          userId,
          ...JSON.parse(JSON.stringify(checkUser))
        }
      ]);
    }

    const accessToken = jwt.sign(
      { userId, sessionId: session._id },
      config.JWT.ACCESS_TOKEN_SECRET as string,
      { expiresIn: config.JWT.ACCESS_TOKEN_EXPIRE_IN }
    );

    let stripeAccountId: string | null = null;
    let stripeReady: boolean = false;
    const walletCheck = await WALLET.findOne({ user: userId }, "stripeAccountId stripeReady", { upsert: true }).lean();
    if (walletCheck) {
      stripeAccountId = walletCheck.stripeAccountId ?? null;
      stripeReady = walletCheck.stripeReady ?? false;
    }

    // // Send Kafka notifications for session management
    // const kafkaMessages = [];

    // // 1. Notify the logged-out session
    // if (loggedOutSession) {
    //   kafkaMessages.push({
    //     key: `session-logout-${userId}`,
    //     value: {
    //       type: "SESSION_LOGOUT",
    //       userId: userId.toString() as string,
    //       fcmToken: loggedOutSession.fcmToken,
    //       device: loggedOutSession.device,
    //       location: loggedOutSession.location,
    //       message: "You have been logged out due to a new login from another device"
    //     }
    //   });
    // }

    // // 2. Notify other active sessions about new login
    // const otherActiveSessions = await SESSION.find({
    //   user: userId,
    //   _id: { $ne: session._id }
    // }, "fcmToken");

    // if (otherActiveSessions.length > 0) {
    //   const tokens = otherActiveSessions.map(s => s.fcmToken).filter(Boolean);

    //   if (tokens.length > 0) {
    //     kafkaMessages.push({
    //       key: `new-login-alert-${userId}`,
    //       value: {
    //         type: "NEW_LOGIN_ALERT_BULK",
    //         userId: userId.toString(),
    //         tokens: tokens,
    //         title: "🔐 New Login Detected",
    //         body: `New login from ${deviceData.toAgent()} at ${sessionData.location || "Unknown location"}`,
    //         customData: {
    //           type: "security_alert",
    //           timestamp: new Date().toISOString()
    //         }
    //       }
    //     });
    //   }
    // }

    // // Send Kafka messages
    // if (kafkaMessages.length > 0) {
    //   try {
    //     await sendBulkNotificationKafka(kafkaMessages);
    //   } catch (kafkaError) {
    //     console.error("Kafka notification error:", kafkaError);
    //     // Don't fail the login if Kafka fails
    //   }
    // }

    return handleResponse(res, 200, {
      userId,
      accessToken,
      refreshToken,
      userPreferences: checkUserPreference,
      paymentId: stripeAccountId,
      paymentReady: stripeReady
    });
  } catch (err: any) {
    console.log(err);
    sendErrorToDiscord("POST:login", err);
    return handleResponse(res, 500, errors.catch_error);
  }
};

