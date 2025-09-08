import { documentType, userType } from '@label/core';
import { buildAssignationRepository } from '../repository';

export { assertDocumentIsAssignatedToUser };

async function assertDocumentIsAssignatedToUser({
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

  if (!assignation) {
    throw new Error(
      `No assignation found for userId ${userId} and documentId ${documentId}`,
    );
  }
}
