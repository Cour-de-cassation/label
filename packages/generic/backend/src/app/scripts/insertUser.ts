import { userType } from '@label/core';
import { userService } from '../../modules/user';
import { logger } from '../../utils';

export { insertUser };

async function insertUser({
  email,
  name,
  password,
  role,
}: {
  email: string;
  name: string;
  password: string;
  role: userType['role'];
}) {
  logger.log(
    `insertUser ${JSON.stringify(
      {
        email,
        name,
        role,
      },
      null,
      2,
    )}`,
  );

  await userService.signUpUser({
    email,
    name,
    password,
    role,
  });
}
