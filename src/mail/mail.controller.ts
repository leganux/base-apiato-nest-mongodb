import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(
    @Body('from') from: string,
    @Body('to') to: string[],
    @Body('subject') subject: string,
    @Body('html') html: string,
    @Body('cc') cc?: string[],
    @Body('attachments') attachments?: any[],
  ) {
    return this.mailService.sendMail(from, to, subject, html, cc, attachments);
  }
}
