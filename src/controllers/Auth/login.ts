import { Request, Response } from "express";
import { validateLogin } from "../../validators/validators";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { handleResponse, errors} from "../../utils/responseCodec";
import { config } from "../../config/generalconfig";
import { USER } from "../../models/User/user.model";
import { SESSION } from "../../models/User/userSession.model";
import { fetchIpGeolocation } from "../../utils/IP_helpers";
import useragent from 'useragent'

interface LoginRequest {
  email: string;
  password: string;
  fcmToken : string;
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

export const login = async (req: Request, res: Response) => {
  try {
    const validationError: Joi.ValidationError | undefined = validateLogin(req.body);
    if (validationError) {
      return handleResponse(res, 400, errors.validation, validationError.details);
    }
    const { email, password , fcmToken} = req.body as LoginRequest;
    const checkUser = await USER.findOne({ email, password }, "_id")
    if (!checkUser) {
      return handleResponse(res, 400, errors.invalid_credentials);
    }
    const userId = checkUser._id
    const accessToken = jwt.sign(
      { userId },
      config.JWT.ACCESS_TOKEN_SECRET as string,
      { expiresIn: config.JWT.ACCESS_TOKEN_EXPIRE_IN }
    );
    const refreshToken = jwt.sign({ userId }, config.JWT.REFRESH_TOKEN_SECRET as string)
    const checkSession = await SESSION.find({ userId } , "_id" ,  { sort: { createdAt: -1 } })
    if(checkSession && checkSession.length >= config.MAX_LOGIN_SESSION){
      await SESSION.findByIdAndDelete(checkSession[0]._id)
    }
    const geoData: any = await fetchIpGeolocation(req.ip)
    const deviceData = useragent.parse(req.headers['user-agent'])
    await SESSION.create({
      user : userId,
      refreshToken,
      ip: req.ip,
      device: deviceData.toAgent(),
      os: deviceData.os.toString(),
      location: geoData ? `${geoData.city}, ${geoData.country_name}` : undefined
    })
    return handleResponse(res, 200, { accessToken, refreshToken });
  } catch (err: any) {
	  console.log("login-errors" , err) 
    return handleResponse(res, 500, errors.catch_error);
  }
};
