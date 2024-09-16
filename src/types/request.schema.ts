import { AdminProfile, User, UserProfile } from "@prisma/client";

export interface RequestSchema extends Request {
    userId: string;
    user: (User & {userProfile: UserProfile} & {adminProfile: AdminProfile});
    ipAddress : string;
    params: { [key: string]: any };
}
