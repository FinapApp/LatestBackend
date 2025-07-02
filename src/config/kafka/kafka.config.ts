import { Kafka } from "kafkajs";
import { generateAuthToken  }  from "aws-msk-iam-sasl-signer-js"


async function oauthBearerTokenProvider(region : string) {
    // Uses AWS Default Credentials Provider Chain to fetch credentials
    const authTokenResponse = await generateAuthToken({ region });
    return {
        value: authTokenResponse.token
    }
 }
export const kafka = new Kafka({
    clientId: "notification-services-flickstar",
    brokers: ["boot-ipft11ob.c3.kafka-serverless.ap-south-1.amazonaws.com:9098"],
    ssl: true,
    sasl: {
        mechanism: 'oauthbearer',
        oauthBearerProvider: () => oauthBearerTokenProvider('ap-south-1')
    }
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


