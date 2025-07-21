import * as nodemailer from 'nodemailer'
import { nodemailerConfig } from '../config/nodemailer/nodemailer.config'
import { config } from '../config/generalconfig'

export const sendForgotPasswordEmail = (resetCode: string, email: string, name: string ) => {
    try {
        let transporter = nodemailer.createTransport(nodemailerConfig)
        let message = {
            from: config.EMAILCONFIG.user,
            to: email,
            subject: "Flickstar Password Reset Request 🔐",
            html: `<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Flickstar Password Reset</title>
      <style>
         body {
         margin: 0;
         padding: 0;
         background-color: #f4f4f4;
         font-family: Arial, sans-serif;
         }
         table {
         border-spacing: 0;
         }
         td {
         padding: 0;
         }
         img {
         border: 0;
         }
         .email-container {
         max-width: 600px;
         margin: 0 auto;
         background-color: #ffffff;
         border-radius: 8px;
         overflow: hidden;
         box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
         }
         .email-header {
         background-color: purple;
         padding: 20px;
         text-align: center;
         color: #ffffff;
         }
         .otp-text {
         background-color: purple;
         text-align: center;
         color: white;
         padding: 10px;
         font-size: 24px;
         border-radius: 5px;
         display: inline-block;
         margin-top: 10px;
         }
         .email-header h1 {
         margin: 0;
         font-size: 24px;
         }
         .email-body {
         padding: 20px;
         }
         .email-body h2 {
         text-align: center;
         font-size: 20px;
         color: #333333;
         }
         .email-body p {
         font-size: 16px;
         line-height: 1.5;
         color: #555555;
         }
         .email-footer {
         padding: 20px;
         text-align: center;
         background-color: #f4f4f4;
         color: #888888;
         }
         .email-footer a {
         color: purple;
         text-decoration: none;
         }
         .button {
         display: block;
         background-color: purple;
         color: #ffffff;
         padding: 10px 20px;
         text-decoration: none;
         border-radius: 5px;
         font-size: 16px;
         margin-top: 20px;
         margin-inline:auto;
         width: 200px;
         text-align: center;
         }
         @media (max-width: 600px) {
         .email-container {
         width: 100%;
         }
         }
      </style>
   </head>
   <body>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f4f4f4">
         <tr>
            <td align="center">
               <table class="email-container" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                     <td class="email-header">
                        <h1>Password Reset Request</h1>
                     </td>
                  </tr>
                  <tr>
                     <td class="email-body">
                        <h2>Hi ${name || "User"},</h2>
                        <p>We received a request to reset the password for your Flickstar account associated with <strong>${email}</strong>.</p>
                        <p>To proceed with resetting your password, please use the following One-Time Password (OTP):</p>
                        <div style="text-align: center;">
                           <div class="otp-text">${resetCode}</div>
                        </div>
                        <p>This OTP is valid for a short period. Please enter it in the app or website to confirm your identity and reset your password.</p>
                        <p>If you did not request a password reset, you can safely ignore this email. No changes will be made without your confirmation.</p>
                        <p>Thanks for being part of the Flickstar community.<br>The Flickstar Team</p>
                     </td>
                  </tr>
                  <tr>
                     <td class="email-footer">
                        <p>Need help? <a href="https://about.flickstar.net/contact-us">Contact Support</a></p>
                        <p>&copy; 2024 Flickstar.net, All rights reserved.</p>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>
      </table>
   </body>
</html>`
        }
        return transporter.sendMail(message)
    } catch (err) {
        console.log(err)
    }
}
