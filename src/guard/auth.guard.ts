import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HelperService } from 'src/helper/helper.service';

import { JWTHelperService } from 'src/helper/jwt-helper.service';
import { ResponseHelperService } from 'src/helper/response-helper.service';
import { AdminAccountType } from 'src/models/global.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExtendedUser } from 'src/user/user.types';
import { AuthGuardType } from 'src/models/global.model';
import { JWTRequestType } from 'src/models/jwt-payload.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtHelper: JWTHelperService,
    private prisma: PrismaService,
    private reflector: Reflector,
    private singleResponseHelper: ResponseHelperService<string>,
    private helperService: HelperService
  ) {}
  

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accountTypes = this.reflector.get<AuthGuardType[]>('accountTypes', context.getHandler());

    if(accountTypes.includes(AuthGuardType.ANONYMOUS)) {
        return true;
    }

    const authorizationHeader = request.headers.authorization;
    let token: string | undefined = undefined;

    if (authorizationHeader?.startsWith('Bearer ')) {
      token = authorizationHeader.split(' ')[1];
    } else {
      const cookieString = request.headers.cookie
      if(cookieString) {
        const cookieObj = this.helperService.convertStringToObject(cookieString,";","=");
        token = cookieObj?.token;
      }
    }

    if (!token) {
      this.singleResponseHelper.returnUnAuthorized('You do not have the action right');
    }

    const jwtResponse = await this.jwtHelper.readToken(token);

    if (!jwtResponse || jwtResponse.requestType !== JWTRequestType.Login) {
      this.singleResponseHelper.returnUnAuthorized('You do not have the action right');
    }

    const userId = jwtResponse.userId;

    request.userId = userId;

    const foundUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { adminProfile: true, userProfile: true },
    });

    if (!foundUser) {
      this.singleResponseHelper.returnUnAuthorized("You do not have the action right");
    }

    const userWithoutPassword = this.helperService.exclude(foundUser, 'password')
    request.user = userWithoutPassword;

    const userAccountType = this.getUserAccountType(foundUser);
    const isAccountAuthenticated = accountTypes.some((accountType) => userAccountType.includes(accountType));

    if(!isAccountAuthenticated)
      {
        this.singleResponseHelper.returnUnAuthorized("Unauthorize");
        return false;
      }
    let ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    ip = ip.toString().replace('::ffff:', ''); 

    request.ipAddress = ip;

    return true;
  }

  private getUserAccountType(user: ExtendedUser): string {
    let role: string;

    if (user.isAdmin) {
      if (user.adminProfile?.userAccountType === AdminAccountType.SUPERADMIN) {
        role = AuthGuardType.SUPERADMIN;
      } else {
        role = AuthGuardType.ADMIN;
      }
    } else {
      role = AuthGuardType.USER;
    }

    return role;
  }
}
