import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [PrismaService, AuthGuard],
  exports: [AuthGuard],
})
export class GuardModule {}
