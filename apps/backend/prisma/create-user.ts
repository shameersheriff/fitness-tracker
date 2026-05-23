import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('test1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'shameersheriff100@gmail.com' },
    update: { passwordHash },
    create: {
      firstName: 'Shameer',
      lastName: 'Sheriff',
      email: 'shameersheriff100@gmail.com',
      passwordHash,
      activityLevel: 'MODERATE',
    },
  });
  console.log('User ready:', user.id, user.email);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
