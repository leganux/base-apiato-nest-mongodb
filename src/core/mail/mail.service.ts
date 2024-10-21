import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as process from 'node:process';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE == 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    } as SMTPTransport.Options);
  }

  async sendMail(
    from: string = 'noreply@leganux.com',
    to: string[],
    subject: string,
    html: string,
    cc?: string[],
    attachments?: any[],
  ) {
    const mailOptions = {
      from,
      to,
      subject,
      html,
      cc,
      attachments,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { message: 'Email sent', info };
    } catch (error) {
      console.error(error);
      throw new Error(`Error sending email: ${error.message}`);
    }
  }
}
