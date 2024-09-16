import { AccountVerificationStage } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

class User {
  @ApiProperty({
    title: 'User ID',
    description: 'Unique ID of the user',
  })
  id: string;

  @ApiProperty({
    title: 'Full Name',
    description: 'Full name of the user',
  })
  fullName: string;

  @ApiProperty({
    title: 'Email',
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({
    title: 'Profile Verification',
    description: "Account verification type",
  })
  accountVerification: AccountVerificationStage;

  @ApiProperty({
    title: 'Request Profile Deletion',
    description: "Account deletion",
  })
  requestDelete?: boolean;
}

export class AdminResponseModel {
  @ApiProperty({
    title: 'User Details',
    description: 'Details of the user associated with the admin',
  })
  user: User;
}
