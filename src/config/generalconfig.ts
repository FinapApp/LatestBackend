import * as dotenv from "dotenv";

dotenv.config();
export const config = {
  MELLISSEARCH: {
    host: process.env.MELLISSEARCH_HOST!,
    masterKey: process.env.MEILI_MASTER_KEY!,
    // userIndex: process.env.MELLISSEARCH_USER_INDEX!,
    // flickIndex :process.env.MELLISSEARCH_FLICK_INDEX!,  
  },
  REFERRAL : {
    referrerReward: parseFloat(process.env.REFERRAL_REFERRER_REWARD!) || 2,
    referredUserReward: parseFloat(process.env.REFERRAL_REFERRED_USER_REWARD!) || 1,
  },
  MONGODB: {
    URI: process.env.MONGO_URI!,
  },
  REDIS: process.env.REDIS_URI!,
  REDIS_EXPIRE_IN: process.env.REDIS_EXPIRE_IN || 900,
  REDIS_EXPIRE_IN_STATIC: process.env.REDIS_EXPIRE_IN_STATIC || 86400,
  DefaultTTL: 2 * 60,
  JWT: {
    ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET!,
    ACCESS_TOKEN_EXPIRE_IN: process.env.JWT_EXPIRE_IN! || '15m',
    REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET!,
  },
  R2 : {
    R2_ENDPOINT: process.env.R2_ENDPOINT!,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID!,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY!,
    R2_REGION: process.env.R2_REGION!,
    R2_BUCKET: process.env.R2_BUCKET!,
    R2_PUBLIC_URL: process.env.R2_PUBLIC_URL!
  },
  EMAILCONFIG: {
    user: process.env.GMAIL_USER!,
    pass: process.env.GMAIL_PASSWORD!,
  },
  STRIPE_PRIVATE_KEY :  process.env.PRIVATE_KEY!  ,
  MAX_OTP_COUNT_LIMIT: 5,
  MAX_LOGIN_SESSION: 2,
  MASTER_OTP: process.env.MASTER_OTP!,
  APPVERSION: process.env.APP_VERSION!,
  NODE_ENV: process.env.NODE_ENVIRONMENT!,
  PROJECT_ENV: process.env.PROJECT_ENVIRONMENT!,
  PORT: process.env.PORT!,
  ITEMS_PER_PAGE: 10,
  IP_GEOLOCATOR_KEY: process.env.IP_GEOLOCATOR_KEY!,
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL!,
  SMS : {
    AUTHENTIC_KEY: process.env.AUTHENTIC_KEY_MSG91!, 
    SIGNUP_OTP_TEMPLATE: process.env.TEMPLATE_ID_SIGNUP_MSG91!,
    FORGET_PASSWORD_TEMPLATE: process.env.TEMPLATE_ID_FORGET_PASSWORD_MSG91!,
    TWO_FACTOR_AUTH_TEMPLATE: process.env.TEMPLATE_ID_TWO_FACTOR_AUTH_MSG91!
  },
  QR_SECRET: process.env.QR_SECRET!,
  QR_EXPIRE_TIME: process.env.QR_EXPIRE_TIME! || "1d",
}
