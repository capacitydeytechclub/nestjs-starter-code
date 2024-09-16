import { Module } from '@nestjs/common';
import { GoogleStrategy, JwtStrategy } from '../auth/strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtStrategy, GoogleStrategy],
})
export class UserModule {}
