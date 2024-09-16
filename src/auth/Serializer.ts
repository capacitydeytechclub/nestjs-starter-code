import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private prisma: PrismaService) {
    super();
  }

  serializeUser(user: any, done: (err: Error | null, id?: any) => void) {
    done(null, user);
  }

  async deserializeUser(payload: any, done: (err: Error | null, user?: any) => void) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
}
