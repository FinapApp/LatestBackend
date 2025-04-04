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
import bcrypt from "bcrypt";
import { USERPREFERENCE } from "../../models/User/userPreference.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";

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

interface User {
  password: string;
  _id: string;
}


interface UserPreference {
  _id: string;
  theme: string;
  textSize: string;
  nightMode: boolean;
  twoFactor: boolean;
  twoFactorMethod: string;
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
    const checkUser = await USER.findOne(
      query,
      "_id password"
    ) as User;
    if (!checkUser) {
      return handleResponse(res, 400, errors.invalid_credentials);
    }
    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, checkUser.password);
    if (!passwordMatch) {
      return handleResponse(res, 400, errors.invalid_credentials);
    }

    const userId = checkUser._id;
    const checkUserPreference = await USERPREFERENCE.findById(userId, "theme textSize nightMode twoFactor -_id") as UserPreference;
    // SEND NOTIFICATION TO ALL SESSIONS ABOUT THIS LOGIN
    if (checkUserPreference?.twoFactor && checkUserPreference?.twoFactorMethod == "email") {
      // Send OTP to email
    } else {
      // Send OTP to phone
    }
    // Generate tokens
    const accessToken = jwt.sign(
      { userId },
      config.JWT.ACCESS_TOKEN_SECRET as string,
      { expiresIn: config.JWT.ACCESS_TOKEN_EXPIRE_IN }
    );

    const refreshToken = jwt.sign(
      { userId },
      config.JWT.REFRESH_TOKEN_SECRET as string
    );

    // Manage user sessions
    const checkSession = await SESSION.find({ userId }, "_id", {
      sort: { createdAt: -1 },
    });

    if (checkSession && checkSession.length >= config.MAX_LOGIN_SESSION) {
      await SESSION.findByIdAndDelete(checkSession[0]._id);
    }

    // Fetch IP and device data
    const geoData: any = await fetchIpGeolocation(req.ip);
    const deviceData = useragent.parse(req.headers["user-agent"]);

    // Save session
    await SESSION.create({
      user: userId,
      refreshToken,
      fcmToken,
      ip: req.ip,
      device: deviceData.toAgent(),
      os: deviceData.os.toString(),
      location: geoData ? `${geoData.city}, ${geoData.country_name}` : undefined,
    });
    return handleResponse(res, 200, { accessToken, refreshToken, userPreferences: checkUserPreference});
  } catch (err: any) {
    sendErrorToDiscord("POST:login", err);
    return handleResponse(res, 500, errors.catch_error);
  }
};
