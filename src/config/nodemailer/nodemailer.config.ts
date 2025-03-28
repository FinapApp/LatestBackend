import { config } from "../generalconfig";

interface nodeMailerConf {
    host: string, 
    port: number,
    service :   string;
    secure: boolean,
    auth: {
        user: string,
        pass: string,
    }
}
/*
 export let nodemailerConfig: nodeMailerConf = {
     host: 'smtp.zoho.com',
     port: 465,
     secure: true,
     auth: config.EMAILCONFIG,
 }
*/

 export let nodemailerConfig: nodeMailerConf = {
	host: 'smtp.gmail.com',
	port  : 587 ,
	service : 'gmail',
	secure : false , 
    auth: config.EMAILCONFIG,
}

