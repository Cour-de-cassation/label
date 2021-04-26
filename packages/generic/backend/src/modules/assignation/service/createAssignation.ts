import { assignationModule, idType } from '@label/core';
import { treatmentService } from '../../treatment';
import { buildAssignationRepository } from '../repository';

export { createAssignation };

async function createAssignation({
  userId,
  documentId,
}: {
  userId: idType;
  documentId: idType;
}) {
  const assignationRepository = buildAssignationRepository();
  const treatmentId = await treatmentService.createTreatment({
    documentId,
    previousAnnotations: [],
    nextAnnotations: [],
    source: 'annotator',
  });
  const assignation = assignationModule.lib.buildAssignation({
    userId,
    documentId,
    treatmentId,
  });

  await assignationRepository.insert(assignation);

  return assignation;
}
