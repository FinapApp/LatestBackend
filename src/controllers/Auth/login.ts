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
interface LoginRequest {
  email?: string;
  username?: string;
  phone?: string;
  password: string;
  fcmToken: string;
}
/**
 * Handles user login.
 *
 * @param req - The request object containing user login details.
 * @param res - The response object to send the response.
 * @returns A response with access and refresh tokens if login is successful, or an error message if login fails.
 *
 * @throws Will return a 400 status code if validation fails or user credentials are invalid.
 * @throws Will return a 500 status code if an unexpected error occurs.
 */
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
    // Find user by email
    const query: Record<string, string> = {}
    if (email) query.email = email;
    else if (username) query.username = username;
    else if (phone) query.phone = phone;
    // Asked for regex in the frontend to indentify whether to give email or phone or username
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
      // when in resend otp we often dont have to search back again and again and cache could do the thing.
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
    const checkSession = await SESSION.find({ userId }, "_id", {
      sort: { createdAt: -1 },
    });
    if (checkSession && checkSession.length >= config.MAX_LOGIN_SESSION) {
      await SESSION.findByIdAndDelete(checkSession[0]._id);
    }
    // Fetch IP and device data
    const geoData: any = await fetchIpGeolocation(req.ip);
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
      ip: req.ip,
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
