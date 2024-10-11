import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // O puedes usar otra configuración SMTP
      auth: {
        user: process.env.GMAIL_USER, // Configurado en tu .env
        pass: process.env.GMAIL_PASS, // Configurado en tu .env
      },
    });
  }

  async sendMail(
    from: string,
    to: string[],
    subject: string,
    html: string,
    cc?: string[],
    attachments?: any[],
  ) {
    const mailOptions = {
      from, // Remitente
      to, // Destinatarios
      subject, // Asunto del correo
      html, // Contenido en HTML
      cc, // Copia de correo (opcional)
      attachments, // Adjuntos (opcional)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { message: 'Email sent', info };
    } catch (error) {
      throw new Error(`Error sending email: ${error.message}`);
    }
  }
}
