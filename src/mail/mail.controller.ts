import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';

@Controller('api/v1/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() sendMailDto: SendMailDto) {
    return this.mailService.sendMail(
      sendMailDto.from,
      sendMailDto.to,
      sendMailDto.subject,
      sendMailDto.html,
      sendMailDto.cc,
      sendMailDto.attachments,
    );
  }
}
