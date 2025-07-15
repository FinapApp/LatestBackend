import { Kafka } from "kafkajs";
import { generateAuthToken } from "aws-msk-iam-sasl-signer-js"


async function oauthBearerTokenProvider(region: string) {
    // Uses AWS Default Credentials Provider Chain to fetch credentials
    const authTokenResponse = await generateAuthToken({ region });
    return {
        value: authTokenResponse.token
    }
}

export const kafka = new Kafka({
    clientId: "notification-services-flickstar",
    brokers: ["boot-xszmsp2k.c3.kafka-serverless.ap-south-1.amazonaws.com:9098"],
    ssl: true,
    sasl: {
        mechanism: 'oauthbearer',
        oauthBearerProvider: () => oauthBearerTokenProvider('ap-south-1')
    }
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
  
export const kafkaProducer = kafka.producer()


export const sendNotificationKafka = async (key: string, messages: any) => {
    await kafkaProducer.connect();
    await kafkaProducer.send({
        topic: "notification-services",
        messages: [{ key, value: JSON.stringify(messages) }],
    });
    await kafkaProducer.disconnect();
}


