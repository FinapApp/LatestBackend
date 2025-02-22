import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "notification-services-flickstar",
    brokers: ["localhost:9092"],
});
export async function kafkaConnecter() {
    const admin = kafka.admin();
    await admin.connect();
    console.log("Admin Connected")
    await admin.createTopics({
        topics: [
            { topic: 'notification-services', numPartitions: 2 },
            { topic: 'auth-services', numPartitions: 2 }
        ]
    });
    await admin.disconnect();
}


export const kafkaProducer = kafka.producer()


export const sendMessage = async (topic: string, key: string, messages: any) => {
    await kafkaProducer.connect();
    await kafkaProducer.send({
        topic,
        messages: [{ key, value: JSON.stringify(messages) }],
    }); // { key: `sms-promotion`, value: JSON.stringify({ msgTriggered, templateId, location }) }
    await kafkaProducer.disconnect();
}


