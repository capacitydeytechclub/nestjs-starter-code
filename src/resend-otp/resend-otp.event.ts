import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { User } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { Constants } from 'src/models/global.model';

interface Details extends User {}
export interface reSendOTPEventListenersPayload {
  otp?: string;
  password?: string;
  details: Details;
}
export const reSendOTPEventPayload = (
  payload: reSendOTPEventListenersPayload,
): reSendOTPEventListenersPayload => payload;
@Injectable()
export class reSendOTPEventListener {
  /**
   *
   */
  constructor(
    private configService: ConfigService,
    private mailer: MailService,
  ) {}
  @OnEvent(Constants.NEW_USER_CREATED)
  async handleClientAccountCreated(payload: reSendOTPEventListenersPayload) {
    this.mailer.sendMail(
      payload.details.email,
      'Verification Email',
      'welcome-user',
      {
        name: payload.details.fullName,
        otp: payload.otp,
        logo: this.configService.get<string>('LOGO'),
      },
    );
  }

  @OnEvent(Constants.RESET_PASSWORD)
  async handleResetPassword(payload: reSendOTPEventListenersPayload) {
    this.mailer.sendMail(
      payload.details.email,
      'Password Reset Code',
      'reset-password',
      {
        name: payload.details.fullName,
        otp: payload.otp,
        logo: this.configService.get<string>('LOGO'),
      },
    );
  }

  @OnEvent(Constants.NEW_ADMIN_CREATED)
  async handleNewAdminAccountCreated(payload: reSendOTPEventListenersPayload) {
    this.mailer.sendMail(
      payload.details.email,
      'Admin Account Created',
      'welcome-admin',
      {
        name: payload.details.fullName,
        email: payload.details.email,
        password: payload.password,
        logo: this.configService.get<string>('LOGO'),
      },
    );
  }

  @OnEvent(Constants.USER_TO_ADMIN)
  async handleUserToAdminAccount(payload: reSendOTPEventListenersPayload) {
    this.mailer.sendMail(
      payload.details.email,
      'User Account Updated To Admin',
      'user-to-admin',
      {
        name: payload.details.fullName,
        email: payload.details.email,
        logo: this.configService.get<string>('LOGO'),
      },
    );
  }

  @OnEvent(Constants.VERIFY_EMAIL)
  async handleVerifyEmail(payload: reSendOTPEventListenersPayload) {
    this.mailer.sendMail(
      payload.details.email,
      'Verify Email Code',
      'verify-email',
      {
        name: payload.details.fullName,
        otp: payload.otp,
        logo: this.configService.get<string>('LOGO'),
      },
    );
  }
}
