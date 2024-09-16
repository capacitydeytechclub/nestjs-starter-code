import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, Matches  } from 'class-validator';

export class RequestResetPasswordDto {
  @ApiProperty({
    title: 'Email',
    description: 'Email of the user',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    title: 'New Password',
    description: 'New Password of the user',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Password has to be between 3 and 20 chars' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is weak',
  })
  password: string;

  @ApiProperty({
    title: 'Confirm Password',
    description: 'Confirm Password of the user',
  })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @ApiProperty({
    title: 'Token',
    description: 'Token of the user',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
