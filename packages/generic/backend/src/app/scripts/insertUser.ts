import { userType } from '@label/core';
import { userService } from '../../modules/user';

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
  await userService.signUpUser({
    email,
    name,
    password,
    role,
  });
}
