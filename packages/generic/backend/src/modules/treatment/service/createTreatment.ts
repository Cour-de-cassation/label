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
    document.decisionMetadata.computedAdditionalTerms,
    document.decisionMetadata.additionalTermsParsingFailed,
    document.decisionMetadata.debatPublic,
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

  const actionToPerform = `create treatment "${source}" for documentId ${idModule.lib.convertToString(
    documentId,
  )}`;

  annotationsDiffModule.lib.assertAnnotationsDiffAreConsistent(
    annotationsDiff,
    {
      settings: settingsForDocument,
      previousAnnotations,
      treatmentSource: source,
    },
    actionToPerform,
  );

  treatmentModule.lib.assertTreatmentsSourcesFollowRightOrder([
    ...sortedTreatments,
    treatment,
  ]);

  await treatmentRepository.insert(treatment);

  return treatment._id;
}
