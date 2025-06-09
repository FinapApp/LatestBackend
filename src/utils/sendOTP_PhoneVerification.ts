
import axios from 'axios'
import { config } from '../config/generalconfig'




const { AUTHENTIC_KEY: authentic_key ,SIGNUP_OTP_TEMPLATE  : templateId } = config.SMS

export const sendOTPPhoneVerification = async (OTP: string, phone: string) => {
    try {
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
        console.log('OTP sent successfully:', response.data)
        console.log(response)   
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}
