import { Module } from '@nestjs/common';
import { ResendOtpService } from './resend-otp.service';
import { ResendOtpController } from './resend-otp.controller';

@Module({
  controllers: [ResendOtpController],
  providers: [
    ResendOtpService,
  ],
})
export class ResendOtpModule {}
