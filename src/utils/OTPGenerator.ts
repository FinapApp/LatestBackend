import crypto from "crypto";
// export const generateOTP = () => {
//     const otp = Array.from(crypto.randomBytes(7))
//         .map((byte) => byte.toString(10))
//         .join("")
//         .slice(0, 6);
//     return otp
// }

export const generateOTP = (length = 6) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(crypto.randomBytes(length))
        .map((byte) => chars[byte % chars.length]) // Ensures the byte maps to a valid character
        .join("");
};
