import { idModule, preAssignationType } from '@label/core';
import { buildPreAssignationRepository } from '..';
import { userService } from '../../user';

export { fetchAllPreAssignation, fetchPreAssignationBySourceAndNumber };

async function fetchAllPreAssignation() {
  const preAssignationRepository = buildPreAssignationRepository();
  const preAssignations = await preAssignationRepository.findAll();

  const usersByIds = await userService.fetchUsersByIds(
    preAssignations.map(({ userId }) => userId),
  );

  return preAssignations.map((preAssignation) => {
    const userIdString = idModule.lib.convertToString(preAssignation.userId);
    return {
      preAssignation,
      userName: usersByIds[userIdString].name,
    };
  });
}

async function fetchPreAssignationBySourceAndNumber(
  number: string,
  source: string,
): Promise<preAssignationType | undefined> {
  const preAssignationRepository = buildPreAssignationRepository();
  return preAssignationRepository.findOneByNumberAndSource({
    number,
    source,
  });
}
