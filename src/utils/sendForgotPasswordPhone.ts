
import axios from 'axios'
import { config } from '../config/generalconfig'
const { AUTHENTIC_KEY: authentic_key, FORGET_PASSWORD_TEMPLATE  : templateId } = config.SMS

export const sendForgotPasswordPhone = async (OTP: string, phone: string) => {
    try {
        console.log("asdasdasdasd====>"   ,templateId)
        const response = await axios.post(
            'https://control.msg91.com/api/v5/flow/',
            {
                template_id: templateId,
                recipients: [{ mobiles: `${phone}`, var1: OTP }],
            },
            {
                headers: {
                    authkey: authentic_key,
                },
            },
        )
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}
