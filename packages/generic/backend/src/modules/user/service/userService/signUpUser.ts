import { userModule, userType } from '@label/core';
import { buildUserRepository } from '../../repository';

const DEFAULT_ROLE = 'annotator';

export { signUpUser };

async function signUpUser({
  email,
  name,
  password,
  role = DEFAULT_ROLE,
}: {
  email: string;
  name: string;
  password: string;
  role?: userType['role'];
}) {
  const userRepository = buildUserRepository();
  const newUser = await userModule.lib.buildUser({
    email,
    name,
    password,
    role,
  });

  return userRepository.insert(newUser);
}
