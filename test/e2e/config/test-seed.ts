import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { userWithNormalRole } from '../mock/data/users';
import { USER_ID_SYSTEM } from '@src/permissions/users';

const prisma = new PrismaClient();

async function main() {
  const id = 'Seeding';
  console.time(id);
  console.log('Start seeding ....');

  await addUsers();

  console.log('Finish seeding ....');
  console.timeEnd(id);
}

async function addUsers() {
  console.log('\t- Add users');
  const users = [];

  users.push(
    await shouldIncludeUser(
      userWithNormalRole.email,
      userWithNormalRole.password,
      {
        firstName: userWithNormalRole.firstName,
        lastName: userWithNormalRole.lastName,
        roleId: userWithNormalRole.roleId,
        createdById: USER_ID_SYSTEM,
      },
    ),
  );

  for (const user of users) {
    if (user) {
      await prisma.user.create({
        data: user,
      });
    }
  }
}

async function shouldIncludeUser(
  username: string,
  password: string,
  userData: any,
) {
  if (username && password) {
    const hash = await argon.hash(password, {
      secret: Buffer.from(process.env.AUTH_SECRET, 'utf-8'),
    });
    const user = {
      ...userData,
      email: username,
      password: hash,
    };
    return user;
  }
}

main();
