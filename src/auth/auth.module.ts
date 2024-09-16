import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy, JwtStrategy } from './strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './Serializer';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthEventListener } from './auth.event';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({
      session: true,
    }),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    SessionSerializer,
    AuthEventListener,
  ],
})
export class AuthModule {}
