/* eslint-disable prettier/prettier */
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";




interface MailBody {
    email: string;
    subject: string;
    text: string;
    html: string;
}
@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService){}




    async sendMail(mailBody : MailBody) : Promise<void> {
        this.mailerService.sendMail({
            to: mailBody.email,
            //from: 'support@mivant.co',
           subject: mailBody.subject  ,      //'OTP ✔',
            text: mailBody.text,
            html: mailBody.html,
        });
    }

   
}
