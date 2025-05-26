import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "notification-services-flickstar",
    brokers: ["kafka:9092"],
});
export async function kafkaConnecter() {
    const admin = kafka.admin();
    await admin.connect();
    console.log("Flickstar Kafka Admin Connected");
    await admin.createTopics({
        topics: [
            { topic: 'notification-services', numPartitions: 2 },
        ]
    });
    await admin.disconnect();
}


export const kafkaProducer = kafka.producer()


export const sendNotificationKafka = async (key: string, messages: any) => {
    await kafkaProducer.connect();
    await kafkaProducer.send({
        topic: "notification-services",
        messages: [{ key, value: JSON.stringify(messages) }],
    });
    await kafkaProducer.disconnect();
}


