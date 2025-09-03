import { userType } from '@label/core';
import { buildUserRepository } from '../../repository';

export { updateUser };

async function updateUser({
  userId,
  name,
  role,
}: {
  userId: userType['_id'];
  name: string;
  role: userType['role'];
}) {
  const userRepository = buildUserRepository();
  return await userRepository.updateNameAndRoleById(userId, name, role);
}
