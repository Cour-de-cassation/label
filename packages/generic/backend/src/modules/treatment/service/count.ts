import { documentType } from '@label/core';
import { buildTreatmentRepository } from '../repository';

export { countTreatmentsByDocumentId };

async function countTreatmentsByDocumentId({
  documentId,
}: {
  documentId: documentType['_id'];
}): Promise<number> {
  const treatmentRepository = buildTreatmentRepository();

  return treatmentRepository.countByDocumentId(documentId);
}
