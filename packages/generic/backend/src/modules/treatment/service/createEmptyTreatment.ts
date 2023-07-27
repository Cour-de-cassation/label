import { documentType, treatmentModule, treatmentType } from '@label/core';
import { buildTreatmentRepository } from '../repository';

export { createEmptyTreatment };

async function createEmptyTreatment({
  documentId,
  source,
}: {
  documentId: documentType['_id'];
  source: treatmentType['source'];
}): Promise<treatmentType['_id']> {
  const treatmentRepository = buildTreatmentRepository();

  const previousTreatments = await treatmentRepository.findAllByDocumentId(
    documentId,
  );
  const sortedTreatments =
    treatmentModule.lib.sortInConsistentOrder(previousTreatments);
  const order =
    sortedTreatments.length > 0
      ? sortedTreatments[sortedTreatments.length - 1].order + 1
      : 0;

  const treatment = treatmentModule.lib.buildEmpty({
    annotationsDiff: { before: [], after: [] },
    documentId,
    order,
    source,
  });

  await treatmentRepository.insert(treatment);

  return treatment._id;
}
