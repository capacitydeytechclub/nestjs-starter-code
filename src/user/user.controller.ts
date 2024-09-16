import {
  Body,
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  Patch,
  Query,
  Delete
} from '@nestjs/common';
import { EditUserDto } from '../auth/dto';
import { UserService } from './user.service';
import { ApiTags, ApiOkResponse,ApiBody , getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { AccountTypes } from 'src/guard/property.decorator';
import { AuthGuardType, ResponseModel } from 'src/models/global.model';
import { RequestSchema } from 'src/types/request.schema';
import { AdminProfileResponseModel, UserModel, UserProfileResponseModel } from 'src/models/user.model';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiExtraModels(
  EditUserDto, 
  ResponseModel, 
  UserModel, 
  AdminProfileResponseModel, 
  UserProfileResponseModel
)
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('me')
  @AccountTypes(AuthGuardType.USER, AuthGuardType.ADMIN, AuthGuardType.SUPERADMIN)
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserModel) },
          },
        },
      ],
    },
  })
  async getMyProfile(
    @Req() req: RequestSchema
  ) {
    return this.usersService.getMyProfile(req);
  }

  @Get('getById/:id')
  @AccountTypes(AuthGuardType.USER, AuthGuardType.ADMIN, AuthGuardType.SUPERADMIN)
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserModel) },
          },
        },
      ],
    },
  })
  async getUserById(
    @Param('id') id: string, 
    @Req() req: RequestSchema
  ) {
    return this.usersService.getUserById(id, req);
  }

  @Get('all')
  @AccountTypes(AuthGuardType.ADMIN, AuthGuardType.SUPERADMIN)
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(UserModel) },
            },
          },
        },
      ],
    },
  })
  async getAllUsers(
    @Query() query : {isAdmin : boolean}
  ) {
    return this.usersService.getAllUsers(query.isAdmin);
  }

  @Patch('request-delete')
  @AccountTypes(AuthGuardType.USER, AuthGuardType.ADMIN, AuthGuardType.SUPERADMIN)
  @ApiOkResponse({
    description: 'Request for account deletion.',
    schema: { $ref: getSchemaPath(ResponseModel) },
  })
  async requestDeleteUser(@Req() req: RequestSchema) {
    return await this.usersService.requestDeleteUser(req);
  }

  @Patch(':id')
  @AccountTypes(AuthGuardType.USER, AuthGuardType.ADMIN, AuthGuardType.SUPERADMIN)
  @ApiBody({ type: EditUserDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserModel) },
          },
        },
      ],
    },
  })
  async editUser(
    @Param('id') id: string,
    @Req() req: RequestSchema,
    @Body() dto: EditUserDto,
  ) : Promise<ResponseModel<UserModel>>  {
    return await this.usersService.editUser(id, req, dto);
  }

  @Delete('confirm-delete/:id')
  @AccountTypes(AuthGuardType.ADMIN, AuthGuardType.SUPERADMIN)
  @ApiOkResponse({
    description: 'Permanent deletion of user.',
    schema: { $ref: getSchemaPath(ResponseModel) },
  })
  async deleteUser(
    @Param('id') id: string
  ) {
    return await this.usersService.deleteUser(id);
  }
}
