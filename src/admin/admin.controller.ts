import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/admin.dto';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AdminResponseModel } from 'src/models/admin.model';
import { AuthGuard } from 'src/guard/auth.guard';
import { AccountTypes } from 'src/guard/property.decorator';
import { AuthGuardType, ResponseModel } from 'src/models/global.model';

@ApiTags('admin')
@Controller('admin')
@UseGuards(AuthGuard)
@ApiExtraModels(CreateAdminDto, ResponseModel, AdminResponseModel)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  @AccountTypes(AuthGuardType.SUPERADMIN)
  @ApiOperation({
    summary: 'Create a new admin',
    description: "Only super admin can create admin account",
  })
  @ApiBody({ type: CreateAdminDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(AdminResponseModel) },
          },
        },
      ],
    },
  })
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<ResponseModel<AdminResponseModel>> {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get()
  @AccountTypes(AuthGuardType.SUPERADMIN)
  @ApiOperation({ summary: 'Fetch all the admin' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(AdminResponseModel) },
            },
          },
        },
      ],
    },
  })
  async getAllAdmin(): Promise<ResponseModel<AdminResponseModel[]>> {
    return this.adminService.getAllAdmin();
  }

  @Get(':adminId')
  @AccountTypes(AuthGuardType.ADMIN, AuthGuardType.SUPERADMIN)
  @ApiOperation({ summary: 'Fetch a single admin' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(AdminResponseModel) },
          },
        },
      ],
    },
  })
  async getAdmin(
    @Param('adminId') adminId: string,
  ): Promise<ResponseModel<AdminResponseModel>> {
    return this.adminService.getAdmin(adminId);
  }

  @Delete('remove/:adminId')
  @AccountTypes(AuthGuardType.SUPERADMIN)
  @ApiOperation({ summary: 'Remove an admin' })
  @ApiOkResponse({
    schema: {
      allOf: [{ $ref: getSchemaPath(ResponseModel) }],
    },
  })
  async removeAdmin(
    @Param('adminId') adminId: string,
  ): Promise<ResponseModel<AdminResponseModel>> {
    return this.adminService.removeAdmin(adminId);
  }
}
