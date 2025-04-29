import { config } from "../generalconfig";

import axios  from 'axios'

export async function sendErrorToDiscord(routes: string, error: any) {
    try {
        if (config.PROJECT_ENV == "production") {
            const webhookURL = config.DISCORD_WEBHOOK_URL;
            const message = {
                content: `**Error Encountered:**\n\`\`\`\n${error}\n\`\`\`
        \n**Route:**\n\`\`\`\n${routes}\n\`\`\``,
            };
            await axios.post(webhookURL, message);
            console.log('Error sent to Discord successfully.');
        }else{
            console.log("====> I was not logged to the group")
        }
    } catch (error) {
        console.error('Error sending to Discord:', error);
    }
}