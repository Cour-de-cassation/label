import { userType } from '@label/core';
import { buildUserRepository } from '../../repository';

export { fetchUserRole };

async function fetchUserRole(userId: userType['_id']) {
  const userRepository = buildUserRepository();

  const user = await userRepository.findById(userId);

  return user.role;
}
