import { kafkaProducer } from "../config/kafka/kafka.config";

export const sendNotificationKafka = async (key: string, messages: any) => {
    await kafkaProducer.send({
        topic: "notification-services",
        messages: [{ key, value: JSON.stringify(messages) }],
    });
}


export const sendBulkNotificationKafka = async (messages: Array<{ key: string, value: any }>) => {
    await kafkaProducer.send({
        topic: "notification-services",
        messages: messages.map(msg => ({
            key: msg.key,
            value: JSON.stringify(msg.value)
        })),
    });
}