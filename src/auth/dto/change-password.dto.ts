import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    title: 'Current Password',
    description: 'User current password',
  })
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20, { message: 'Password has to be between 3 and 20 chars' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is weak',
  })
  @ApiProperty({
    title: 'New Password',
    description: 'New password for the user account',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    title: 'Confirm Password',
    description: 'Re-enter the new password',
  })
  confirmPassword: string;
}
