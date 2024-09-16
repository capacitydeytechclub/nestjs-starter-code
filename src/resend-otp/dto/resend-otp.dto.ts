import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsEnum } from "class-validator";
import { Constants } from "src/models/global.model";

export class ResendOtpDto {
  @ApiProperty({
    title: 'Email Address',
    description: 'Email address of user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    title: 'Email Template',
    description: 'Which email template to send',
  })
  @IsEnum(Constants)
  @IsNotEmpty()
  emailType: Constants;
}
