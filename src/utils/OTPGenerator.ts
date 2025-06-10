import crypto from "crypto";

export const generateNumericOTP = (length = 6) => {
    const digits = "0123456789";
    return Array.from(crypto.randomBytes(length))
        .map(byte => digits[byte % digits.length])
        .join('');
};