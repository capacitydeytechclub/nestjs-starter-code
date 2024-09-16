import { ConflictException, Injectable } from '@nestjs/common';
import { Constants, AdminAccountType, ResponseModel } from 'src/models/global.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto } from './dto/admin.dto';
import { ResponseHelperService } from 'src/helper/response-helper.service';
import { AdminResponseModel } from 'src/models/admin.model';
import * as argon from 'argon2';
import { AccountVerificationStage } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { authEventPayload } from 'src/auth/auth.event';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly singleResponseHelper: ResponseHelperService<AdminResponseModel>,
    private readonly multiResponseHelper: ResponseHelperService<AdminResponseModel[]>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createAdmin(
    createAdminDto: CreateAdminDto,
  ): Promise<ResponseModel<AdminResponseModel>> {
    const { fullName, email, password } = createAdminDto;

    // check if the user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: {
          mode: 'insensitive',
          equals: email,
        },
      },
    });

    const userObject = {
      id: true,
      fullName: true,
      email: true,
      password: true,
      accountVerification: true,
      requestDelete: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
    }

    if (existingUser) {
      // if the user is already an admin, throw an error
      if (existingUser.isAdmin) {
        throw new ConflictException('User already an admin');
      }

      // create an admin profile for the existing user
      const adminProfile = await this.prisma.adminProfile.create({
        data: {
          userAccountType: AdminAccountType.ADMIN,
          user: {
            connect: {
              id: existingUser.id,
            },
          },
        },
        select: {
          id: true,
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              accountVerification: true,
            },
          },
        },
      });

      // Update the user's isAdmin flag and connect the adminProfile
      const user = await this.prisma.user.update({
        where: { id: adminProfile.user.id },
        data: {
          isAdmin: true,
          adminProfile: {
            connect: {
              id: adminProfile.id,
            },
          },
        },
      });

      // Send New Admin login details
      this.eventEmitter.emit(
        Constants.USER_TO_ADMIN,
        authEventPayload({
          details: user,
        }),
      );

      return this.singleResponseHelper.returnSuccessObject(
        'Admin created successfully',
      );
    }

    // generate the password hash
    const hash = await argon.hash(password);

    // Create a new user and admin profile
    const newAdmin = await this.prisma.adminProfile.create({
      data: {
        userAccountType: AdminAccountType.ADMIN,
        user: {
          create: {
            fullName,
            email,
            password: hash,
            isAdmin: true,
            accountVerification: AccountVerificationStage.PASSWORD_UPDATE_REQUIRED,
          },
        },
      },
      select: {
        id: true,
        user: {
          select: userObject,
        },
      },
    });

    // Send New Admin login details
    this.eventEmitter.emit(
      Constants.NEW_ADMIN_CREATED,
      authEventPayload({
        details: newAdmin.user,
        password: password,
      }),
    );

    return this.singleResponseHelper.returnSuccessObject(
      'Admin created successfully',
    );
  }

  async getAllAdmin(): Promise<ResponseModel<AdminResponseModel[]>> {
    const admins = await this.prisma.adminProfile.findMany({
      where: {
        userAccountType: AdminAccountType.ADMIN,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            accountVerification: true,
          },
        },
      },
    });

    if (admins.length === 0) {
      this.multiResponseHelper.returnNotFound('No admin found');
    }

    return this.multiResponseHelper.returnSuccessObject(
      'Admin data fetched successfully',
      admins,
    );
  }

  async getAdmin(id: string): Promise<ResponseModel<AdminResponseModel>> {
    const admin = await this.prisma.adminProfile.findUnique({
      where: {
        id,
        userAccountType: AdminAccountType.ADMIN,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            accountVerification: true,
          },
        },
      },
    });

    if (!admin) {
      this.singleResponseHelper.returnNotFound('Admin not found');
    }

    return this.singleResponseHelper.returnSuccessObject(
      'Admin data fetched successfully',
      admin,
    );
  }

  async removeAdmin(id: string): Promise<ResponseModel<AdminResponseModel>> {
    await this.prisma.$transaction(async (prisma) => {
      const admin = await prisma.adminProfile.findUnique({
        where: { id },
      });

      if (!admin) {
        return this.singleResponseHelper.returnNotFound(
          'Admin with the ID not found',
        );
      }

      await prisma.adminProfile.delete({
        where: { id },
      });

      await prisma.user.update({
        where: { id: admin.userId },
        data: {
          isAdmin: false,
        },
      });
    });
    return this.singleResponseHelper.returnSuccessObject(
      'Admin removed successfully',
    );
  }
}
