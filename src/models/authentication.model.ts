import { ApiProperty } from '@nestjs/swagger';
import { RegisterationMetaData } from './global.model';
import { IsOptional } from 'class-validator';

export class RegisterResponseModel {
  @ApiProperty({
    description: 'Token to be returned with otp for verification',
    title: 'Registration Response Token',
  })
  @IsOptional()
  token?: string;

  @ApiProperty({
    description: 'Metadata to be returned to know the next screen to display',
    title: 'Registration Response Metadata',
  })
  @IsOptional()
  metadata?: RegisterationMetaData;
}

export class VerifyUserResponseModel {
  @ApiProperty()
  @IsOptional()
  token?: string;
  @ApiProperty({
    description: 'Metadata to be returned to know the next screen to display',
    title: 'Verification Response Metadata',
  })
  @IsOptional()
  metadata?: RegisterationMetaData;
}

export class ChangePasswordResponseModel {
  @ApiProperty({
    title: 'User Account ID',
    description: 'User Account ID',
  })
  userId: string;
  @ApiProperty({
    description: 'Metadata to be returned to know the next screen to display',
    title: 'ChangePassword Response Metadata',
  })
  @IsOptional()
  metadata?: RegisterationMetaData;
}

export class ResetPasswordResponseModel {
  @ApiProperty({
    description: 'Token to be returned with otp for verification',
    title: 'Reset Password Token',
  })
  @IsOptional()
  token?: string;
  @ApiProperty({
    description: 'Metadata to be returned to know the next screen to display',
    title: 'ResetPassword Response Metadata',
  })
  @IsOptional()
  metadata?: RegisterationMetaData;
}
