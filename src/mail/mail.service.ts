import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

 /**
 * Sends an email using the mailer service.
 *
 * @param to - The recipient's email address.
 * @param subject - The email subject line.
 * @param template - The name or path to the email template.
 * @param [context] - Optional data to be inserted into the template.
 */
  async sendMail(to: string, subject: string, template: string, context?: any) {
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }
}
