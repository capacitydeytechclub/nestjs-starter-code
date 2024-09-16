import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength, IsString, MinLength, Matches, Length } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  @IsOptional()
  @ApiPropertyOptional({
    title: 'Admin Fullname',
    description: 'Full name of the admin to be created if he has no account',
  })
  fullName?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    title: 'Admin Email Address ',
    description: 'Email address of admin to be created',
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
}
