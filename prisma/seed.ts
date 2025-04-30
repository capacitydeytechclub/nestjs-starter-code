import { PrismaClient, AdminAccountType, AccountVerificationStage } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await argon.hash('Admin123');

  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      fullName: 'Super Admin',
      email: 'admin@test.com',
      password: hashedPassword,
      accountVerification: AccountVerificationStage.VERIFIED,
      isAdmin: true,
      adminProfile: {
        create: {
          userAccountType: AdminAccountType.SUPERADMIN,
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
