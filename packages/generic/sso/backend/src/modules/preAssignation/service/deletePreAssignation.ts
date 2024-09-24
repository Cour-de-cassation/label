import { preAssignationType } from '@label/core';
import { buildPreAssignationRepository } from '../repository';

export { deletePreAssignation };

async function deletePreAssignation(
  preAssignationId: preAssignationType['_id'],
) {
  const preAssignationRepository = buildPreAssignationRepository();

  await preAssignationRepository.deleteById(preAssignationId);
}
