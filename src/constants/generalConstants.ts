
import { Connection } from 'mongoose'
import firebaseAdmin from 'firebase-admin'
// import cron from '../utils/cron'
import { config } from '../config/generalconfig'

export const constants = {
    // cron: undefined as typeof cron | undefined,
    db: undefined as Connection | undefined,
    firebaseAdmin: undefined as typeof firebaseAdmin | undefined,
    accessTokenExpiry: config.PROJECT_ENV ? '15d' : '15m',
    refreshTokenExpiry: '90d',
    maxLoginSessions: 4,
    phoneRegex: 'string|regex:/^\\+\\d{1,3}\\s\\d{5,15}$/',
    lenientPhoneRegex: 'string|regex:/^(?:\\+?\\d{1,3}[-\\s]?)?\\d{5,15}$/',
    usernameRegex: 'string|regex:/^(?=.*\\D)[\\w._]{5,15}$/',
    otpExpiryInMinutes: 10,
    maxWarning: 4,
    battleExpiryInHours: 72,
    battleTeamColors: ['#ffff00', '#ff0000', '#00ff00', '#0000ff', '#f0000f', '#0ff000'],
    maxFcmTokens: 4,
    maxCountForLikeNotification: 10,
    maxCountForCommentNotification: 20,
    minimumAccountDeletionDate: 14,
    notificationAtCount: '1,2,3,4,5,6,7,8,9,10,11,21,31,41,51,61,71,81,91,101,201,301,401,501,601,701,801,901,1001,2001,3001,4001,5001,6001,7001,8001,9001,10001,20001,30001,40001,50001,60001,70001,80001,90001,100001,200001,300001,400001,500001,600001,700001,800001,900001,1000001,2000001,3000001,4000001,5000001,6000001,7000001,8000001,9000001,10000001,20000001,30000001,40000001,50000001,60000001,70000001,80000001,90000001,100000001'.split(',').map(e => +e)
}
