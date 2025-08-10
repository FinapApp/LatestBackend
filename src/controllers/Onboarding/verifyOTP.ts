    import { Request, Response } from "express";
    import { validateVerifyOTPSignUp } from "../../validators/validators";
    import Joi from "joi";
    import { handleResponse, errors, success, Lang } from "../../utils/responseCodec";
    import { redis } from "../../config/redis/redis.config";
    import { config } from "../../config/generalconfig";
    import { USER } from "../../models/User/user.model";
    import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
    import { getIndex } from "../../config/melllisearch/mellisearch.config";
    import bcrypt from "bcryptjs";
    import { REFERRAL } from "../../models/Referral/referral.model";
    import { generateNumericOTP } from "../../utils/OTPGenerator";
    interface ForgetOTPRequest {
        email: string;
        otp: string;
        fcmToken: string;
        name: string;
        password: string;
        phone: string;
        dob: Date;
        country: string;
        username: string;
    }
    export const verifyOTPAfterSignUp = async (req: Request, res: Response) => {
            const lang = req.query.lang as Lang || 'en';
        try {
            const validationError: Joi.ValidationError | undefined = validateVerifyOTPSignUp(req.body as ForgetOTPRequest, req.query);
            if (validationError) {
                return handleResponse(res, 400, errors.validation, lang , validationError.details);
            }
            const { email, phone, otp, fcmToken, password, ...rest } = req.body as ForgetOTPRequest;
            // Fetch OTP from Redis
            const [emailData, phoneData] = await Promise.all([
                redis.get(`OTP:${email}`),
                redis.get(`OTP:${phone}`)
            ]);
            const redisDataRaw = emailData || phoneData;
            if (!redisDataRaw) {
                return handleResponse(res, 400, errors.otp_expired, lang);
            }
            let redisData: any;
            try {
                redisData = JSON.parse(redisDataRaw);
            } catch {
                return handleResponse(res, 400, errors.otp_expired , lang);
            }
            const storedOTP = redisData?.OTP;
            if (!storedOTP || (otp !== storedOTP && otp !== config.MASTER_OTP)) {
                return handleResponse(res, 400, errors.otp_not_match , lang);
            }
            // Prepare user data
            const createUser: any = {
                fcmToken,
                ...rest
            };
            if (email && email != null) createUser.email = email;
            if (phone && phone != null) createUser.phone = phone;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                createUser.password = hashedPassword;
            }
            // Create user
            const userCreate = await USER.create(createUser) as {
                _id: string;
                toObject: () => Record<string, any>;
            };
            if (!userCreate) {
                return handleResponse(res, 400, errors.unable_to_create_user , lang);
            }
            let code: string;
            let exists: boolean;
            do {
                code = generateNumericOTP(6);
                exists = !!(await REFERRAL.exists({ code }));
            } while (exists);
            await REFERRAL.create({ user: userCreate._id, code });
            // Clean up OTP
            await Promise.all([
                redis.del(`OTP:${email}`),
                redis.del(`OTP:${phone}`)
            ]);
            // Add to Meilisearch
            const rawUser = userCreate.toObject();
            const { _id, password: _, ...safeUser } = rawUser;
            const userIndex = getIndex("USERS");
            await userIndex.addDocuments([
                {
                    userId: _id.toString(),
                    email,
                    phone,
                    ...safeUser,
                    dob: new Date(safeUser.dob).toISOString()
                }
            ]);
            return handleResponse(res, 200, success.account_created, lang);
        } catch (err: any) {
            console.log(err);
            if (err.code === 11000) {
                const key = err?.keyValue ? Object.keys(err.keyValue)[0] : null;
                if (key === "email") return handleResponse(res, 500, errors.email_exist, lang);
                if (key === "username") return handleResponse(res, 500, errors.username_exist, lang);
                if (key === "phone") return handleResponse(res, 500, errors.phone_exist, lang);
            }
            sendErrorToDiscord("POST:verify-otp", err);
            return handleResponse(res, 500, errors.catch_error, lang);
        }
    };
