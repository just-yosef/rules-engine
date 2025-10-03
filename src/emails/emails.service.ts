import { BadRequestException, Injectable } from '@nestjs/common';
import nodemailer, { Transporter, } from "nodemailer"
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailsService {
    transporter: Transporter
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        } as SMTPTransport.Options)
    }
    async sendEmail({ toEmail, message }: { toEmail: string, message: string }) {
        try {
            return await this.transporter.sendMail({
                from: "nest@system.com",
                to: toEmail,
                text: message,
                subject: "Verfiy User Email"
            })
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
