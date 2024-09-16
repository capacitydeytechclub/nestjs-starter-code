import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from '../auth/dto';
import { AccountVerificationStage } from '@prisma/client';
import { RequestSchema } from 'src/types/request.schema';
import { ResponseHelperService } from 'src/helper/response-helper.service';
import { UserModel } from 'src/models/user.model';
import { ResponseModel } from 'src/models/global.model';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private userResponseHelper: ResponseHelperService<UserModel>,
    private usersResponseHelper: ResponseHelperService<UserModel[]>
  ) {}

  async getUserById(id: string, req: RequestSchema) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        userProfile: true,
        adminProfile: true,
      },
    });

    if (!user) {
      this.userResponseHelper.returnNotFound('User not found');
    }

    const decodedUser = req.user as { id: string; email: string };

    if (user.id !== decodedUser.id) {
      this.userResponseHelper.returnForbidden('Incorrect user id');
    }
  
    delete user.password;

    return this.userResponseHelper.returnSuccessObject(
      'User fetched successfully',
      user,
    );
  }

  async getMyProfile(req: RequestSchema) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      include: {
        userProfile: true,
        adminProfile: true,
      },
    });

    if (!user) {
      return this.userResponseHelper.returnNotFound('User not found');
    }
    
    delete user.password;

    return this.userResponseHelper.returnSuccessObject(
      'User fetched successfully',
      user,
    );
  }

  async getAllUsers(isAdmin :boolean) {
    const users = await this.prisma.user.findMany({
      where: {
        isAdmin:isAdmin
      },
      include: {
        userProfile: true,
        adminProfile: true,
      },
    });

    const usersWithDetails = users.map(user => {
      delete user.password;
  
      return user;
    });

    return this.usersResponseHelper.returnSuccessObject(
      'Users fetched successfully',
      usersWithDetails,
    );
  }

  async editUser(
    id: string, 
    req: RequestSchema, 
    dto: EditUserDto
  ) : Promise<ResponseModel<UserModel>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userProfile: true,
        adminProfile: true,
      },
    });

    if(!user) {
      this.userResponseHelper.returnBadRequest("No user found");
    }

    const decodedUser = req.user as { id: string; email: string };

    if (user.id !== decodedUser.id) {
      this.userResponseHelper.returnBadRequest("You do not have permission");
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      include: {
        userProfile: true,
        adminProfile: true,
      },
      data: {
        fullName: dto.fullName,
        accountVerification: AccountVerificationStage.VERIFIED,
        isAdmin: dto.isAdmin,
        userProfile: {
          update: {
            picture: dto.picture,
            gender: dto.gender,
            dob: dto.dob,
            phoneNumber: dto.phoneNumber,
          }
        },
        adminProfile: {
          update: {
            userAccountType: dto.userAccountType
          }
        }
      },
    });

    delete updatedUser.password;

    return this.userResponseHelper.returnSuccessObject(
      'User updated successfully',
      updatedUser);
  }

  async requestDeleteUser(
    req: RequestSchema,
  ): Promise<ResponseModel<UserModel>> {
    const { userId } = req;

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        requestDelete: true,
      },
    });

    return this.userResponseHelper.returnSuccessObject(
      'Request to delete account successfully sent',
    );
  }

  async deleteUser(
    userId: string,
  ): Promise<ResponseModel<UserModel>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
        requestDelete: true,
      },
    });

    if (!user) {
      this.userResponseHelper.returnNotFound('User not found');
    }

    await this.prisma.user.delete({
      where: {
        id: userId,
        requestDelete: true,
      },
    });

    return this.userResponseHelper.returnSuccessObject(
      'User deleted successfully',
    );
  }
}
