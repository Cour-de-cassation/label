import { userType } from '@label/core';
import { logger } from '../../utils';

export { insertUser };

async function insertUser({
  email,
  name,
  role,
}: {
  email: string;
  name: string;
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

  logger.log({ operationName: 'insertUser', msg: 'DONE' });
}
