import { ApiProperty } from "@nestjs/swagger";

export class SendOtpResponseModel {
  @ApiProperty({
    description: 'Token to be returned with otp for verification',
    title: 'Verification Response Token',
  })
  token: string;
}
