import { ApiProperty } from '@nestjs/swagger';
import { User, UserProfile, AdminProfile, AdminAccountType, AccountVerificationStage } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class AdminProfileResponseModel {
    @IsOptional()
    @ApiProperty({
        title: 'Id',
        description: 'Admin Profile Id',
      })
    id?: string;

    @IsOptional()
    @ApiProperty({
        title: 'User Account Type',
        description: 'Admin User Account Type',
      })
    userAccountType?: AdminAccountType;

    @IsOptional()
    @ApiProperty({
        title: 'Created At',
        description: 'Created At',
      })
    createdAt?: Date;

    @IsOptional()
    @ApiProperty({
        title: 'Updated At',
        description: 'Updated At',
      })
    updatedAt?: Date;

    constructor(adminProfile?: AdminProfile){
        this.id = adminProfile?.id;
        this.createdAt = adminProfile?.createdAt;
        this.updatedAt = adminProfile?.updatedAt;
        this.userAccountType = adminProfile?.userAccountType;
    }
}

export class UserProfileResponseModel {
    @IsOptional()
    @ApiProperty({
        title: 'Id',
        description: 'User Profile Id',
      })
    id?: string;

    @IsOptional()
    @ApiProperty({
        title: 'Picture',
        description: 'User Profile Picture',
      })
    picture?: string;

    @IsOptional()
    @ApiProperty({
        title: 'Gender',
        description: 'User Gender',
      })
    gender?: string;

    @IsOptional()
    @ApiProperty({
        title: 'Date of Birth',
        description: 'User Date of Birth',
      })
    dob?: Date;

    @IsOptional()
    @ApiProperty({
        title: 'Phone Number',
        description: 'User Phone Number',
      })
    phoneNumber?: string;

    @IsOptional()
    @ApiProperty({
        title: 'Agreed to Terms and Conditions',
        description: 'Status if User Agreed to Terms and Conditions',
      })
    agreedToTandC?: boolean;

    @IsOptional()
    @ApiProperty({
        title: 'Created At',
        description: 'Created At',
      })
    createdAt?: Date;

    @IsOptional()
    @ApiProperty({
        title: 'Updated At',
        description: 'Updated At',
      })
    updatedAt?: Date; 

    constructor(userProfile?: UserProfile ){
      this.id = userProfile?.id;
      this.picture = userProfile?.picture;
      this.gender = userProfile?.gender;
      this.dob = userProfile?.dob;
      this.phoneNumber = userProfile?.phoneNumber;
      this.agreedToTandC = userProfile?.agreedToTandC;
      this.createdAt = userProfile?.createdAt;
      this.updatedAt = userProfile?.updatedAt;
    }
}

export class UserModel {
    @IsOptional()
    @ApiProperty({
        title: 'Id',
        description: 'User Id',
      })
    id?: string;

    @ApiProperty({
        title: 'FullName',
        description: 'User Full Name',
      })
    fullName: string;

    @ApiProperty({
        title: 'Email',
        description: 'User Email',
      })
    email: string;

    @IsOptional()
    @ApiProperty({
        title: 'Created At',
        description: 'Created At',
      })
    createdAt?: Date;

    @IsOptional()
    @ApiProperty({
        title: 'Updated At',
        description: 'Updated At',
      })
    updatedAt?: Date;

    @ApiProperty({
        title: 'Is Admin',
        description: 'Status if User is Admin',
      })
    isAdmin: boolean;

    @ApiProperty({
        title: 'Account Verification',
        description: 'Account Verification Stage',
      })
    accountVerification: AccountVerificationStage;

    @IsOptional()
    @ApiProperty({
        title: 'Admin Profile',
        description: 'Admin Profile',
      })
    adminProfile?: AdminProfileResponseModel;

    @IsOptional()
    @ApiProperty({
        title: 'User Profile',
        description: 'User Profile',
      })
    userProfile?: UserProfileResponseModel;

    constructor(user: User & {adminProfile? :AdminProfile , userProfile? : UserProfile}) {
        this.id = user.id;
        this.fullName = user.fullName;
        this.email = user.email;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.isAdmin = user.isAdmin;
        this.accountVerification = user.accountVerification;
        this.adminProfile = new AdminProfileResponseModel(user.adminProfile);
        this.userProfile = new UserProfileResponseModel(user.userProfile);
      }
}
