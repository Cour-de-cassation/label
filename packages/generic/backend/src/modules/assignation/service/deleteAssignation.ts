import { assignationType } from '@label/core';
import { buildTreatmentRepository } from '../../../modules/treatment';
import { buildAssignationRepository } from '../repository';

export { deleteAssignation };

async function deleteAssignation(assignationId: assignationType['_id']) {
  const assignationRepository = buildAssignationRepository();
  const treatmentRepository = buildTreatmentRepository();

  const assignation = await assignationRepository.findById(assignationId);
  await treatmentRepository.deleteById(assignation.treatmentId);
  await assignationRepository.deleteById(assignationId);
}
