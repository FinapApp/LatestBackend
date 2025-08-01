import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "notification-services-flickstar",
    brokers: ["13.201.125.159:9092"], // <-- Replace with your VM's IP
    // No ssl or sasl section needed for default, unsecure dev/test setup
});

export async function kafkaConnecter() {
    const admin = kafka.admin();
    try {
        await admin.connect();
        console.log("✅ Flickstar Kafka Admin Connected");

        const existingTopics = await admin.listTopics();
        const topicName = 'notification-services';

        if (existingTopics.includes(topicName)) {
            console.log(`⚠️ Kafka topic "${topicName}" already exists. Skipping creation.`);
        } else {
            const created = await admin.createTopics({
                topics: [{ topic: topicName }],
                waitForLeaders: true,
            });

            if (created) {
                console.log(`✅ Kafka topic "${topicName}" created successfully.`);
            } else {
                console.warn(`⚠️ Kafka topic "${topicName}" was not created (already exists or silent fail).`);
            }
        }
    } catch (error) {
        console.error("❌ Kafka topic creation failed:", error);
    } finally {
        await admin.disconnect();
    }
}

export const kafkaProducer = kafka.producer();
