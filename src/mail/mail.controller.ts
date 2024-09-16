import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendEmail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('template') template: string,
    @Body('context') context: any,
  ) {
    await this.mailService.sendMail(to, subject, template, context);
    return 'Email sent!';
  }
}
