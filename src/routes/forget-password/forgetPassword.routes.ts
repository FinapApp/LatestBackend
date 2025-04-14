
import express, { Router } from "express";
import { forgetPassword } from "../../controllers/ForgetPassword/forgetPassword";
import { verifyOTPForgetPassword } from "../../controllers/ForgetPassword/verifyOTPForgetPassword";
import { updatePasswordAfterOTP } from "../../controllers/ForgetPassword/updatePasswordAfterForget";

export const forgetPasswordRoutes: Router = express.Router();


forgetPasswordRoutes.route("/forget-password")
    .post(forgetPassword)
    .put(updatePasswordAfterOTP)

forgetPasswordRoutes.post("/forget-password-otp" ,verifyOTPForgetPassword)