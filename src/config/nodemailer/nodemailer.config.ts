import { config } from "../generalconfig";

interface nodeMailerConf {
    host: string, 
    port: number,
    secure: boolean,
    auth: {
        user: string,
        pass: string,
    }
}


 export let nodemailerConfig: nodeMailerConf = {
     host: 'smtp.zoho.com',
     port: 465,
     secure: true,
    auth: config.EMAILCONFIG,
}
