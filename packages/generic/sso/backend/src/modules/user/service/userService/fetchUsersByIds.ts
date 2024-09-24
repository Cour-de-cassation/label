import { idModule, idType, indexer } from '@label/core';
import { buildUserRepository } from '../../repository';

export { fetchUsersByIds };

async function fetchUsersByIds(userIds: idType[]) {
  const userRepository = buildUserRepository();
  const usersById = await userRepository.findAllByIds(userIds);

  indexer.assertEveryIdIsDefined(
    userIds.map((userId) => idModule.lib.convertToString(userId)),
    usersById,
    (_id) => `Couldn't find the user with id: ${_id}`,
  );
  return usersById;
}
