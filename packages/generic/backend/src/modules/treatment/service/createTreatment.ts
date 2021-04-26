import {
  annotationType,
  annotationsDiffModule,
  documentType,
  treatmentModule,
  treatmentType,
} from '@label/core';
import { buildTreatmentRepository } from '../repository';

export { createTreatment };

async function createTreatment({
  documentId,
  previousAnnotations,
  nextAnnotations,
  source,
}: {
  documentId: documentType['_id'];
  previousAnnotations: annotationType[];
  nextAnnotations: annotationType[];
  source: treatmentType['source'];
}): Promise<treatmentType['_id']> {
  const treatmentRepository = buildTreatmentRepository();
  const lastTreatment = await treatmentRepository.findLastOneByDocumentId(
    documentId,
  );
  const order = lastTreatment ? lastTreatment.order + 1 : 0;
  const treatment = treatmentModule.lib.build({
    annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
      previousAnnotations,
      nextAnnotations,
    ),
    documentId,
    order,
    source,
  });

  await treatmentRepository.insert(treatment);

  return treatment._id;
}
