import { userType } from '@label/core';
import { buildUserRepository } from '../../repository';

export { setIsActivatedForUser };

async function setIsActivatedForUser({
  userId,
  isActivated,
}: {
  userId: userType['_id'];
  isActivated: userType['isActivated'];
}) {
  const userRepository = buildUserRepository();
  await userRepository.updateOne(userId, { isActivated });
}
