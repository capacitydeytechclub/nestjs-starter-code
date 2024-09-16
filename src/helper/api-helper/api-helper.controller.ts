import { ApiHelperService } from './api-helper.service';
import { ApiOperation, ApiTags,  } from '@nestjs/swagger';
import { Get, HttpCode, HttpStatus, Req, Controller } from '@nestjs/common';
import { Request } from 'express';

@ApiTags('api-helpers')
@Controller('api-helpers')
export class ApiHelperController {
  constructor(private apiHelperService: ApiHelperService) {}

  @HttpCode(HttpStatus.OK)
  @Get('address')
  @ApiOperation({
    summary: 'User Location',
  })
  getAddress(@Req() request: Request) {
    return this.apiHelperService.getAddress(request);
  }
}