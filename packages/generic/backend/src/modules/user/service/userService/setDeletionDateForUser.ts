import { userType } from '@label/core';
import { buildUserRepository } from '../../repository';

export { setDeletionDateForUser };

async function setDeletionDateForUser(userId: userType['_id']) {
  const userRepository = buildUserRepository();
  await userRepository.updateOne(userId, {
    deletionDate: new Date().getTime(),
  });
}
