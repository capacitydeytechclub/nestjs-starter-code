import {
  AdminProfile,
  UserProfile,
  User as PrismaUser,
} from '@prisma/client';

export interface ExtendedUser extends PrismaUser {
  adminProfile?: AdminProfile;
  userProfile?: UserProfile;
}
