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
    host: 'smtp.gmail.com',
    port: 465, // use 465 for SSL or 587 for STARTTLS
    secure: true, // true for port 465, false for 587
    auth: config.EMAILCONFIG,
}
