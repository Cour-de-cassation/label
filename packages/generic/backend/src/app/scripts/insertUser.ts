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
  logger.log({
    operationName: 'insertUser',
    msg: 'START',
    data: {
      email,
      name,
      role,
    },
  });

  await userService.signUpUser({
    email,
    name,
    password,
    role,
  });

  logger.log({ operationName: 'insertUser', msg: 'DONE' });
}
