import { ApiProperty } from '@nestjs/swagger';
import { AdminAccountType, Gender } from 'src/models/global.model';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsEnum,
  IsDate,
  IsPhoneNumber,
  IsBoolean,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  @ApiProperty({
    title: 'Account Fullname',
    description:
      'Full Name of User to be created. Seperate each name by whitespace',
  })
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  @IsString()
  @ApiProperty({
    title: 'Account Email',
    description: 'Email of User to be created',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20, { message: 'Password has to be between 3 and 20 chars' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is weak',
  })
  @ApiProperty({
    title: 'Account Password',
    description: 'Password of account to be created',
  })
  password: string;

  @IsEnum(Gender)
  @IsOptional()
  @ApiProperty({
    title: 'Gender',
    description: 'Gender of User',
    enum: Gender,
    required: false,
  })
  gender?: Gender;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({
    title: 'Date of Birth',
    description: 'Date of Birth of User',
    required: false,
    type: String,
    format: 'date-time',
  })
  dob?: Date;

  @IsPhoneNumber(null)
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    title: 'Phone Number',
    required: false,
    description: 'Phone number of User',
  })
  phoneNumber?: string;
}

export class GoogleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  @IsString()
  email: string;
}

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  @IsString()
  @ApiProperty({
    title: 'Email',
    description: 'User Email',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    title: 'Password',
    description: 'User Password',
  })
  password: string;
}

export class EditUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  picture?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  @ApiProperty({
    title: 'FullName',
    description: 'User Full Name',
  })
  fullName?: string;

  @IsEnum(Gender)
  @IsOptional()
  @ApiProperty({
    title: 'Gender',
    description: 'Gender of User',
    enum: Gender,
    required: false,
  })
  gender?: Gender;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({
    title: 'Date of Birth',
    description: 'Date of Birth of User',
    required: false,
    type: String,
    format: 'date-time',
  })
  dob?: Date;

  @IsPhoneNumber(null)
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    title: 'Phone Number',
    required: false,
    description: 'Phone number of User',
  })
  phoneNumber?: string;

  @IsBoolean()
  @ApiProperty({ default: false })
  isAdmin?: boolean = false;

  @IsEnum(AdminAccountType)
  @IsOptional()
  @ApiProperty({ enum: AdminAccountType })
  userAccountType?: AdminAccountType;
}
