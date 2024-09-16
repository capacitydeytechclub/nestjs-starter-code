import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { HelperModule } from './helper/helper.module';
import { MailModule } from './mail/mail.module';
import { GuardModule } from './guard/guard.module';
import { AdminModule } from './admin/admin.module';
import { ApiHelperModule } from './helper/api-helper/api-helper.module';
import { ResendOtpModule } from './resend-otp/resend-otp.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HelperModule,
    MailModule,
    AuthModule,
    UserModule,
    PrismaModule,
    GuardModule,
    AdminModule,
    ApiHelperModule,
    ResendOtpModule,
  ],
})
export class AppModule {}
