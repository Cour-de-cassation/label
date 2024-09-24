import { userModule, userType } from '@label/core';

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
  return `User created successfully `;
}
