import { userType } from '@label/core';
import { signUpUser } from './signUpUser';

export { createUser };

async function createUser({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: userType['role'];
}) {
  await signUpUser({ name, email, role });
  return `User created successfully `;
}
