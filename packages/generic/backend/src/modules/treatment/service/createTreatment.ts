import {
  annotationType,
  annotationsDiffModule,
  documentType,
  treatmentModule,
  treatmentType,
  idModule,
  settingsModule,
  settingsType,
} from '@label/core';
import { documentService } from '../../document';
import { buildTreatmentRepository } from '../repository';

export { createTreatment };

async function createTreatment(
  {
    documentId,
    previousAnnotations,
    nextAnnotations,
    source,
  }: {
    documentId: documentType['_id'];
    previousAnnotations: annotationType[];
    nextAnnotations: annotationType[];
    source: treatmentType['source'];
  },
  settings: settingsType,
): Promise<treatmentType['_id']> {
  const treatmentRepository = buildTreatmentRepository();

  const previousTreatments = await treatmentRepository.findAllByDocumentId(
    documentId,
  );
  const sortedTreatments = treatmentModule.lib.sortInConsistentOrder(
    previousTreatments,
  );
  const order =
    sortedTreatments.length > 0
      ? sortedTreatments[sortedTreatments.length - 1].order + 1
      : 0;
  const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(
    previousAnnotations,
    nextAnnotations,
  );

  const document = await documentService.fetchDocument(documentId);

  const settingsForDocument = settingsModule.lib.computeFilteredSettings(
    settings,
    document.decisionMetadata.categoriesToOmit,
    document.decisionMetadata.additionalTermsToAnnotate,
  );

  const treatment = treatmentModule.lib.build(
    {
      annotationsDiff,
      documentId,
      order,
      source,
    },
    settingsForDocument,
  );

  if (
    !annotationsDiffModule.lib.areAnnotationsDiffCompatibleWithAnnotations(
      treatmentModule.lib.computeAnnotations(sortedTreatments),
      annotationsDiff,
    )
  ) {
    throw new Error(
      `Could not create treatment for documentId ${idModule.lib.convertToString(
        documentId,
      )}: inconsistent annotations`,
    );
  }

  await treatmentRepository.insert(treatment);

  return treatment._id;
}
