import { Body, Controller, Post, UseGuards, Req, Res } from '@nestjs/common';
import { ResendOtpService } from './resend-otp.service';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ApiBody, ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { AuthGuardType, ResponseModel } from 'src/models/global.model';
import { SendOtpResponseModel } from 'src/models/resend-otp.model';
import { AuthGuard } from 'src/guard/auth.guard';
import { AccountTypes } from 'src/guard/property.decorator';

@ApiTags('resend-otp')
@Controller('resend-otp')
@UseGuards(AuthGuard)
@ApiExtraModels(
  ResponseModel,
  SendOtpResponseModel,
  ResendOtpDto
)
export class ResendOtpController {
  constructor(
    private readonly resendOtpService: ResendOtpService
  ) {}

  @Post()
  @AccountTypes(AuthGuardType.USER, AuthGuardType.ADMIN, AuthGuardType.SUPERADMIN)
  @ApiBody({ type: ResendOtpDto })
  @ApiOperation({
    summary: 'User request to resend confirmation mail',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(SendOtpResponseModel) },
          },
        },
      ],
    },
  })
  async resendOtp(@Body() resendOtpDto: ResendOtpDto, @Req() req, @Res() res) {
    return await this.resendOtpService.resendOtp(resendOtpDto, req, res);
  }
}
