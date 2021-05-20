import { documentType, idModule, treatmentModule, userType } from '@label/core';
import { treatmentService } from '../../../modules/treatment';
import { buildAssignationRepository } from '../repository';
import { createAssignation } from './createAssignation';

export { findOrCreateByDocumentIdAndUserId };

async function findOrCreateByDocumentIdAndUserId({
  documentId,
  userId,
}: {
  documentId: documentType['_id'];
  userId: userType['_id'];
}) {
  const assignationRepository = buildAssignationRepository();
  const treatments = await treatmentService.fetchTreatmentsByDocumentId(
    documentId,
  );
  const lastTreatment = treatmentModule.lib.getLastTreatment(treatments);

  const assignation =
    !!lastTreatment &&
    (await assignationRepository.findByTreatmentId(lastTreatment._id));

  if (assignation && idModule.lib.equalId(assignation.userId, userId)) {
    return assignation;
  }

  return createAssignation({ documentId, userId });
}
