import {  Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto, SignInDto, GoogleDto } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Constants, ResponseModel } from 'src/models/global.model';
import {
  RegisterResponseModel,
  VerifyUserResponseModel,
  ChangePasswordResponseModel,
  ResetPasswordResponseModel,
} from 'src/models/authentication.model';
import { ResponseHelperService } from 'src/helper/response-helper.service';
import { JWTHelperService } from 'src/helper/jwt-helper.service';
import { JWTRequestType } from 'src/models/jwt-payload.model';
import { HelperService } from 'src/helper/helper.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { authEventPayload } from './auth.event';
import { VerifyUserDto } from './dto/verify.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  RequestResetPasswordDto,
  ResetPasswordDto,
} from './dto/reset-password.dto';
import { AccountVerificationStage } from '@prisma/client';
import { RegisterationMetaData } from 'src/models/global.model';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private signInResponseHelper: ResponseHelperService<RegisterResponseModel>,
    private signUpResponseHelper: ResponseHelperService<RegisterResponseModel>,
    private verifyResponseHelper: ResponseHelperService<VerifyUserResponseModel>,
    private jwtHelperService: JWTHelperService,
    private helperService: HelperService,
    private config: ConfigService,
    private eventEmitter: EventEmitter2,
    private changePasswordResponseHelper: ResponseHelperService<ChangePasswordResponseModel>,
    private resetPasswordResponseHelper: ResponseHelperService<ResetPasswordResponseModel>,
  ) {}

  async signup(dto: SignUpDto): Promise<ResponseModel<RegisterResponseModel>> {
    const { fullName, gender, dob, email, phoneNumber, password } = dto;

    const userProfile = await this.prisma.user.findFirst({
      where: {
        email: {
          mode: 'insensitive',
          equals: email,
        },
      },
    });

    // Checks if email is registered
    if (userProfile) {
      this.signUpResponseHelper.returnConflict('User with email exists');
    }

    // generate the password hash
    const hash = await argon.hash(password);

    // Determine the user account verification method
    const accountVerification = AccountVerificationStage.EMAIL_VERIFICATION_REQUIRED;

    // Create new user
    const user = await this.prisma.user.create({
      data: {
        fullName,
        email,
        password: hash,
        isAdmin: false,
        accountVerification,
        userProfile: {
          create: {
            gender,
            dob,
            phoneNumber
          },
        },
      },
    });

    // Send verification mail
    const otp: string = this.helperService.generateOTP(6);
    const token = await this.jwtHelperService.signToken(
      {
        userId: user.id,
        requestType: JWTRequestType.UserVerification,
        otp: otp,
      },
      '1h',
    );

    this.eventEmitter.emit(
      Constants.NEW_USER_CREATED,
      authEventPayload({
        details: user,
        otp:otp,
      }),
    );

    return this.signUpResponseHelper.returnSuccessObject(
      'Account created successfully',
      {
        token: token,
        metadata: RegisterationMetaData.EMAIL_VERIFICATION_REQUIRED,
      },
    );
  }

  async verifyOTP(
    dto: VerifyUserDto,
    res: Response<ResponseModel<VerifyUserResponseModel>>,
  ) {
    const { otp, token } = dto;
    const jwtResponse = await this.jwtHelperService.readToken(token);
    if (jwtResponse == null) {
      this.verifyResponseHelper.returnBadRequest('OTP expired');
    }
    if (jwtResponse.otp != otp) {
      this.verifyResponseHelper.returnBadRequest('Incorrect OTP');
    }
    const user = await this.prisma.user.update({
      data: {
        accountVerification: AccountVerificationStage.VERIFIED,
      },
      where: {
        id: jwtResponse.userId,
      },
    });
    if (user == null) {
      this.verifyResponseHelper.returnInternalServer('User not found');
    }

    // send back the user signin token
    res.cookie('token', token);
    return res.send(this.verifyResponseHelper.returnSuccessObject(
      'OTP Verified successfully',
      {
        token,
        metadata: RegisterationMetaData.VERIFIED,
      },
    ));
  }

  async signin(
    dto: SignInDto,
    res: Response<ResponseModel<RegisterResponseModel>>,
  ) {
    const { email, password } = dto;

    // find user by email
    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          mode: 'insensitive',
          equals: email,
        },
      },
    });

    // if user does not exist throw exception
    if (!user)
      this.signInResponseHelper.returnBadRequest('Incorrect email or password');

    // compare password
    const pwMatches = await argon.verify(user.password, password);
    // if password is incorrect throw exception
    if (!pwMatches)
      this.signInResponseHelper.returnBadRequest('Incorrect email or password');

    if (user.accountVerification === AccountVerificationStage.SUSPENDED)
      this.signInResponseHelper.returnBadRequest(
        'Account suspended',
        {
          metadata: RegisterationMetaData.SUSPENDED,
        }
      );

    const token = await this.jwtHelperService.signToken(
      {
        userId: user.id,
        requestType: JWTRequestType.Login,
      },
      this.config.get<string>('USER_LOGIN_DURATION'),
    );

    // send back the user signin token
    res.cookie('token', token);

    if (user.accountVerification === AccountVerificationStage.EMAIL_VERIFICATION_REQUIRED) {
      return res.send(
        this.signInResponseHelper.returnSuccessObject(
          'Email not verified',
          {
            token,
            metadata: RegisterationMetaData.EMAIL_VERIFICATION_REQUIRED,
          }
        )
      )
    };

    if (user.accountVerification === AccountVerificationStage.PASSWORD_UPDATE_REQUIRED) {
      return res.send(
        this.signInResponseHelper.returnSuccessObject(
          'Password update required',
          {
            token,
            metadata: RegisterationMetaData.PASSWORD_UPDATE_REQUIRED,
          },
        )
      )
    };

    if (user.accountVerification === AccountVerificationStage.PROFILE_UPDATE_REQUIRED) {
      return res.send(
        this.signInResponseHelper.returnSuccessObject(
          'Profile update required',
          {
            token,
            metadata: RegisterationMetaData.PROFILE_UPDATE_REQUIRED,
          },
        )
      )
    };

    return res.send(
      this.signInResponseHelper.returnSuccessObject(
        'Logged in successfully',
        {
          token,
          metadata: RegisterationMetaData.VERIFIED,
        },
      ),
    );
  }

  async signout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Signed out successfully' });
  }

  async validateUser(dto: GoogleDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          mode: 'insensitive',
          equals: dto.email,
        },
      },
    });
    if (user) return user;
    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: '',
        accountVerification: AccountVerificationStage.VERIFIED
      },
    });
    return newUser;
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<ResponseModel<ChangePasswordResponseModel>> {
    const { currentPassword, newPassword, confirmPassword } = dto;

    if (newPassword !== confirmPassword) {
      this.changePasswordResponseHelper.returnBadRequest(
        'New password and confirm password do not match',
      );
    }

    const userPassword = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userPassword) {
      this.changePasswordResponseHelper.returnNotFound('User not found');
    }

    const passwordIsValid = await argon.verify(
      userPassword.password,
      currentPassword,
    );

    if (!passwordIsValid) {
      this.changePasswordResponseHelper.returnBadRequest(
        'Current password is incorrect',
      );
    }

    if (currentPassword === newPassword) {
      this.changePasswordResponseHelper.returnBadRequest(
        'New password cannot be the same as current password',
      );
    }

    const hashedPassword = await argon.hash(newPassword);


    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        accountVerification: user.accountVerification === AccountVerificationStage.PASSWORD_UPDATE_REQUIRED ? AccountVerificationStage.PROFILE_UPDATE_REQUIRED : AccountVerificationStage.VERIFIED,
      },
    });

    return this.changePasswordResponseHelper.returnSuccessObject(
      'Password changed successfully',
      { 
        userId,
        metadata: user.accountVerification === AccountVerificationStage.PROFILE_UPDATE_REQUIRED ? RegisterationMetaData.PROFILE_UPDATE_REQUIRED : RegisterationMetaData.VERIFIED,
      }
    )
  }

  async requestResetPassword(
    dto: RequestResetPasswordDto,
  ): Promise<ResponseModel<ResetPasswordResponseModel>> {
    const { email } = dto;

    const userEmail = await this.prisma.user.findFirst({
      where: {
        email: {
          mode: 'insensitive',
          equals: email,
        },
      },
    });

    if (!userEmail) {
      this.resetPasswordResponseHelper.returnNotFound(
        'User with email not found',
      );
    }

    const otp: string = this.helperService.generateOTP(6);
    const token = await this.jwtHelperService.signToken(
      {
        userId: userEmail.id,
        requestType: JWTRequestType.ResetPassword,
        otp: otp,
      },
      '1h',
    );
    this.eventEmitter.emit(
      Constants.RESET_PASSWORD,
      authEventPayload({
        details: userEmail,
        otp: otp,
      }),
    );

    return this.resetPasswordResponseHelper.returnSuccessObject(
      'Reset password code sent succesfully',
      {
        token: token,
      },
    );
  }

  async resetPassword(
    dto: ResetPasswordDto,
  ): Promise<ResponseModel<ResetPasswordResponseModel>> {
    const { password, confirmPassword, token } = dto;

    if (password != confirmPassword) {
      this.resetPasswordResponseHelper.returnBadRequest(
        'Password and confirm password do not match',
      );
    }

    const jwtResponse = await this.jwtHelperService.readToken(token);

    if (!jwtResponse) {
      this.resetPasswordResponseHelper.returnBadRequest(
        'Token expired or invalid',
      );
    }

    const hashedPassword = await argon.hash(password);

    const user = await this.prisma.user.findUnique({
      where: { id: jwtResponse.userId },
    });

    await this.prisma.user.update({
      data: {
        password: hashedPassword,
        accountVerification: (!user.isAdmin && (user.accountVerification === AccountVerificationStage.PASSWORD_UPDATE_REQUIRED || 
          user.accountVerification === AccountVerificationStage.PROFILE_UPDATE_REQUIRED)) ? 
          AccountVerificationStage.PROFILE_UPDATE_REQUIRED : AccountVerificationStage.VERIFIED,
      },
      where: {
        id: jwtResponse.userId,
      },
    });

    return this.resetPasswordResponseHelper.returnSuccessObject(
      'Password reset successfully',
      {
        metadata: !user.isAdmin && (user.accountVerification === AccountVerificationStage.PASSWORD_UPDATE_REQUIRED || user.accountVerification === AccountVerificationStage.PROFILE_UPDATE_REQUIRED) ? RegisterationMetaData.PROFILE_UPDATE_REQUIRED : RegisterationMetaData.VERIFIED,
      },
    );
  }
}
