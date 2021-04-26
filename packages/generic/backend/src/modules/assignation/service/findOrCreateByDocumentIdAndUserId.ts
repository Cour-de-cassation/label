import { documentType, userType } from '@label/core';
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
  const assignation = await assignationRepository.findByDocumentIdAndUserId({
    documentId,
    userId,
  });

  if (assignation) {
    return assignation;
  }

  return createAssignation({ documentId, userId });
}
