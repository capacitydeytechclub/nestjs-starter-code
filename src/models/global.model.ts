import { ApiProperty } from '@nestjs/swagger';
import { PaginationModel } from './pagination.model';

export class ResponseModel<T> {
  @ApiProperty({
    description: 'Status of the API Call',
    title: 'API Status Response',
  })
  isSuccessful: boolean;
  @ApiProperty({
    description:
      'API response message. This will be the display message in case of an error or where a message needs to be displayed',
    title: 'API Status Response Message',
  })
  message: string;
  @ApiProperty({
    title: 'API Response Data',
    description:
      'API Response Data. This is the data of dto for any API Request. This will be empty if we do not expect any data',
  })
  data?: T;
  @ApiProperty({
    title: 'API Response Data',
    description:
      'API Response Data. This is the data of dto for any API Request. This will be empty if we do not expect any data',
  })
  pagination?: PaginationModel;
}

export enum Constants {
  NEW_USER_CREATED = 'NEW_USER_CREATED',
  NEW_ADMIN_CREATED = 'NEW_ADMIN_CREATED',
  USER_TO_ADMIN = 'USER_TO_ADMIN',
  PASS_DEBIT = 'PASS_DEBIT',
  PASS_CREDIT = 'PASS_CREDIT',
  LOGIN = 'LOGIN',
  PASS_FAILED = 'FAILED',
  FORGET_PASSWORD = 'FORGET_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum AdminAccountType {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
}

export enum AuthGuardType {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  ANONYMOUS = 'ANONYMOUS',
}

export enum RegisterationMetaData {
  EMAIL_VERIFICATION_REQUIRED = 0,
  PASSWORD_UPDATE_REQUIRED = 1,
  PROFILE_UPDATE_REQUIRED = 2,
  SUSPENDED = 3,
  VERIFIED = 4,
}
