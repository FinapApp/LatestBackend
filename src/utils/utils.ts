import crypto from 'crypto'
import { sendNotificationKafka } from './sendNotificationKafka';
import { sendErrorToDiscord } from '../config/discord/errorDiscord';

export function getHash(password: string) {
    const salt = process.env.PASSWORD_SALT!
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    return hash.toString('hex')
}




export const sendFollowNotification = async (
    type: "FOLLOW" | "FOLLOW_REQUEST",
    followerId: string,
    targetId: string,
) => {
    const kafkaMessage = {
        key: type,
        value: {
            userId: followerId,
            targetUserId: targetId,
        },
    };

    try {
        await sendNotificationKafka(type, kafkaMessage);
    } catch (err) {
        sendErrorToDiscord(`Kafka notification error in ${type}`, err);
    }
};
