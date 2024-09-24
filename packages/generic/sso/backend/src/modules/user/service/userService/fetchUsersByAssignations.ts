import { assignationType, idModule, indexer } from '@label/core';
import { buildUserRepository } from '../../repository';

export { fetchUsersByAssignations };

async function fetchUsersByAssignations(assignations: assignationType[]) {
  const userRepository = buildUserRepository();
  const userIds = assignations.map((assignation) => assignation.userId);
  const usersById = await userRepository.findAllByIds(userIds);

  const usersByAssignationId = indexer.mapIndexBy(
    assignations,
    (assignation) => idModule.lib.convertToString(assignation._id),
    (assignation) =>
      usersById[idModule.lib.convertToString(assignation.userId)],
  );

  indexer.assertEveryIdIsDefined(
    assignations.map((assignation) =>
      idModule.lib.convertToString(assignation._id),
    ),
    usersByAssignationId,
    (_id) => `The assignation ${_id} has no matching user`,
  );
  return usersByAssignationId;
}
