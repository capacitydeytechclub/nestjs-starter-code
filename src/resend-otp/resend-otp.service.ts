import { Injectable } from '@nestjs/common';
import { JWTHelperService } from 'src/helper/jwt-helper.service';
import { HelperService } from 'src/helper/helper.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JWTRequestType } from 'src/models/jwt-payload.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendOtpResponseModel } from 'src/models/resend-otp.model';
import { ResponseHelperService } from 'src/helper/response-helper.service';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { Request, Response } from 'express';
import { reSendOTPEventPayload } from './resend-otp.event';
import { Constants } from 'src/models/global.model';
import { User } from '@prisma/client';


interface Details extends User {}
@Injectable()
export class ResendOtpService {
  constructor(
    private prisma: PrismaService,
    private jwtHelperService: JWTHelperService,
    private helperService: HelperService,
    private eventEmitter: EventEmitter2,
    private sendOtpResponseModel: ResponseHelperService<SendOtpResponseModel>,
  ) {}

  async resendOtp(
    sendOtpDto: ResendOtpDto,
    req: Request,
    res: Response
  ) {
    const call = 60 * 1000;
    const initialCallDuration = Date.now();
    const { email, emailType } = sendOtpDto;

    //Fetch user
    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          mode: 'insensitive',
          equals: email,
        },
      },
    });

    const cookieString = req.headers.cookie;
    const cookieObj = this.helperService.convertStringToObject(
      cookieString,
      ';',
      '=',
    );
    let token = cookieObj.token;

    const decodedToken = await this.jwtHelperService.readToken(token);
    const lastCallTime = decodedToken?.nextCallTimeKey;

    const calls = decodedToken?.calls || 0;
    // Check if rate limit is exceeded
    if (lastCallTime > Date.now()) {
      this.sendOtpResponseModel.returnBadRequest(
        'Rate limit exceeded. Please try again later.',
      );
    }

    const otp = this.helperService.generateOTP(6);
    const requestType = JWTRequestType.UserVerification;
    const userId: string = user.id

    // Calculate next call time based on previous call
    let nextCallDuration = initialCallDuration;

    // if (lastCallTime) {
    //   nextCallDuration += call * 2 ** calls; // Double the duration for subsequent calls
    // }
    if (lastCallTime) {
      nextCallDuration += call; // Add exactly 1 minute to the next call time
    }
    const nextCallTime = nextCallDuration;

     // Generate JWT with nextCallTime
    token = await this.jwtHelperService.signToken(
      {
        userId,
        requestType,
        otp,
        nextCallTimeKey: nextCallTime,
        calls: calls + 1,
      },
      '1h',
    );

    const details: Details = emailType === Constants.RESET_PASSWORD ? { ...user } : user;

    this.eventEmitter.emit(
      emailType, 
      reSendOTPEventPayload({
        details,
        otp,
      })
    );

    res.cookie('token', token);
    return res.send(this.sendOtpResponseModel.returnSuccessObject(
      'Verification code sent successfully',
      {
        token,
      },
    ));
  }
}
