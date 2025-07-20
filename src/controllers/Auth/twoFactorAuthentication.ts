import { Request, Response } from "express";
import { validateVerifyOTPAfter2FA } from "../../validators/validators";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { handleResponse, errors } from "../../utils/responseCodec";
import { redis } from "../../config/redis/redis.config";
import { config } from "../../config/generalconfig";
import { USER } from "../../models/User/user.model";
import { SESSION } from "../../models/User/userSession.model";
import { USERPREFERENCE } from "../../models/User/userPreference.model";
import { fetchIpGeolocation } from "../../utils/IP_helpers";
import useragent from "useragent";
import { getIndex } from "../../config/melllisearch/mellisearch.config";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { WALLET } from "../../models/Wallet/wallet.model";
export const twoFactorAuthentication = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateVerifyOTPAfter2FA(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { email, phone, otp, fcmToken } = req.body;
        // Find user by identifier
        const query: Record<string, string> = {};
        if (email) query.email = email;
        else if (phone) query.phone = phone;
        const user = await USER.findOne(query, "_id isDeactivated");
        if (!user) return handleResponse(res, 400, errors.invalid_credentials);
        const userId = user._id;
        // Get OTP from Redis
        const [emailData, phoneData] = await Promise.all([
            redis.get(`2FA-OTP:${email}`),
            redis.get(`2FA-OTP:${phone}`)
        ]);
        const redisDataRaw = emailData || phoneData;
        if (!redisDataRaw) return handleResponse(res, 400, errors.otp_expired);
        let redisData: any;
        try {
            redisData = JSON.parse(redisDataRaw);
        } catch {
            return handleResponse(res, 400, errors.otp_expired);
        }
        if (otp !== redisData.OTP && otp !== config.MASTER_OTP) {
            return handleResponse(res, 400, errors.otp_not_match);
        }

        await Promise.all([
            redis.del(`2FA-OTP:${email}`),
            redis.del(`2FA-OTP:${phone}`)
        ]);
        const checkSession = await SESSION.find({ userId }, "_id", {
            sort: { createdAt: -1 },
        });
        if (checkSession.length >= config.MAX_LOGIN_SESSION) {
            await SESSION.findByIdAndDelete(checkSession[0]._id);
        }
        const IP = req.headers['x-forwarded-for'] || ""
        let geoData: any = await fetchIpGeolocation(IP as string)
        const deviceData = useragent.parse(req.headers["user-agent"]);
        const refreshToken = jwt.sign({ userId }, config.JWT.REFRESH_TOKEN_SECRET as string);
        const sessionData: any = {
            user: userId,
            refreshToken,
            fcmToken,
            ip: IP,
            device: deviceData.toAgent(),
            os: deviceData.os.toString(),
        };
        if (geoData) {
            sessionData.gps = {
                type: "Point",
                coordinates: [geoData.longitude, geoData.latitude],
            };
            sessionData.location = `${geoData.zipcode} ${geoData.city}, ${geoData.state_prov} ${geoData.country_name} ${geoData.continent_name}`;
        }
        const session = await SESSION.create(sessionData);
        const walletCheck = await WALLET.findOne({ user: userId }, "stripeAccountId stripeReady");
        const { stripeAccountId, stripeReady } = walletCheck || {};
        if (user.isDeactivated) {
            user.isDeactivated = false;
            await user.save();
            const userIndex = getIndex("USERS");
            await userIndex.addDocuments([
                {
                    userId,
                    ...JSON.parse(JSON.stringify(user))
                }
            ]);
        }
        const checkUserPreference = await USERPREFERENCE.findById(userId, "theme textSize nightMode twoFactor -_id");
        const accessToken = jwt.sign(
            { userId, sessionId: session._id },
            config.JWT.ACCESS_TOKEN_SECRET as string,
            { expiresIn: config.JWT.ACCESS_TOKEN_EXPIRE_IN }
        );
        return handleResponse(res, 200, {
            userId,
            accessToken,
            refreshToken,
            userPreferences: checkUserPreference,
            paymentReady: stripeReady,
            paymentId: stripeAccountId
        });
    } catch (err: any) {
        console.log(err);
        sendErrorToDiscord("POST:two-factor-auth", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
