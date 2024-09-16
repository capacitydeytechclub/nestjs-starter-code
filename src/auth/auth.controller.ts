import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto, GoogleDto } from './dto';
import { GoogleGuard } from './guard';
import {
  RegisterResponseModel,
  VerifyUserResponseModel,
  ChangePasswordResponseModel,
  ResetPasswordResponseModel,
} from 'src/models/authentication.model';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { VerifyUserDto } from './dto/verify.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AccountTypes } from 'src/guard/property.decorator';
import { RequestSchema } from 'src/types/request.schema';
import {
  RequestResetPasswordDto,
  ResetPasswordDto,
} from './dto/reset-password.dto';
import { AuthGuardType, ResponseModel } from 'src/models/global.model';


@ApiTags('auth')
@Controller('auth')
@ApiExtraModels(
  ResponseModel,
  SignUpDto,
  RegisterResponseModel,
  VerifyUserDto,
  VerifyUserResponseModel,
  ChangePasswordDto,
  ChangePasswordResponseModel,
  ResetPasswordDto,
  ResetPasswordResponseModel,
)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google/signin')
  @UseGuards(GoogleGuard)
  googleSignin() {
    return {
      message: 'Google Authentication',
    };
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleRedirect(@Body() dto: GoogleDto) {
    return this.authService.validateUser(dto);
  }

  @Post('signup')
  @UseGuards(AuthGuard)
  @AccountTypes(AuthGuardType.ANONYMOUS)
  @ApiOperation({
    summary: 'Allows user registration or sign up',
  })
  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(RegisterResponseModel) },
          },
        },
      ],
    },
  })
  async signup(
    @Body() dto: SignUpDto,
  ): Promise<ResponseModel<RegisterResponseModel>> {
    return await this.authService.signup(dto);
  }

  @Post('verify-otp')
  @UseGuards(AuthGuard)
  @AccountTypes(AuthGuardType.ANONYMOUS, AuthGuardType.USER, AuthGuardType.ADMIN, AuthGuardType.SUPERADMIN)
  @ApiOperation({
    summary: 'OTP verification for new users, reset password, ...',
  })
  @ApiBody({
    schema: {
      $ref: getSchemaPath(VerifyUserDto),
    },
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(VerifyUserResponseModel) },
          },
        },
      ],
    },
  })
  async verifyOTP(
    @Body() dto: VerifyUserDto, @Res() res
  ) {
    return await this.authService.verifyOTP(dto, res);
  }

  @Post('signin')
  @UseGuards(AuthGuard)
  @AccountTypes(AuthGuardType.ANONYMOUS)
  @ApiOperation({
    summary: 'User sign in',
  })
  signin(@Body() dto: SignInDto, @Res() res) {
    return this.authService.signin(dto, res);
  }

  @Get('signout')
  @UseGuards(AuthGuard)
  @AccountTypes(AuthGuardType.USER, AuthGuardType.ADMIN, AuthGuardType.SUPERADMIN)
  @ApiOperation({
    summary: 'User sign out',
  })
  signout(@Req() req, @Res() res) {
    return this.authService.signout(req, res);
  }

  @Patch('change-password')
  @UseGuards(AuthGuard)
  @AccountTypes(AuthGuardType.USER, AuthGuardType.ADMIN, AuthGuardType.SUPERADMIN)
  @ApiOperation({
    summary: 'Change user password',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {

            data: { $ref: getSchemaPath(ChangePasswordResponseModel) },
          },
        },
      ],
    },
  })
  async changePassword(
    @Req() req: RequestSchema,
    @Body() dto: ChangePasswordDto,
  ): Promise<ResponseModel<ChangePasswordResponseModel>> {
    return this.authService.changePassword(req.userId, dto);    
  }

  @Post('request-reset-password')
  @UseGuards(AuthGuard)
  @AccountTypes(AuthGuardType.ANONYMOUS, AuthGuardType.USER, AuthGuardType.ADMIN, AuthGuardType.SUPERADMIN)
  @ApiOperation({
    summary: 'User request to reset password',
  })
  @ApiBody({ type: RequestResetPasswordDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {

            data: { $ref: getSchemaPath(ResetPasswordResponseModel) },
          },
        },
      ],
    },
  })
  async requestResetPassword(@Body() dto: RequestResetPasswordDto) {
    return await this.authService.requestResetPassword(dto);
  }

  @Post('reset-password')
  @UseGuards(AuthGuard)
  @AccountTypes(AuthGuardType.ANONYMOUS , AuthGuardType.USER, AuthGuardType.ADMIN, AuthGuardType.SUPERADMIN)
  @ApiOperation({
    summary: 'User reset password',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(ResetPasswordResponseModel) },
          },
        },
      ],
    },
  })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto);
  }
}
