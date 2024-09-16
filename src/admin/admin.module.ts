import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { HelperService } from 'src/helper/helper.service';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    HelperService,
  ],
})
export class AdminModule {}
