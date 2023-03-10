import {
  annotationModule,
  annotationTextDetector,
  annotationType,
  documentModule,
  documentType,
} from '@label/core';
import { flatten } from 'lodash';

export { computeAdditionalAnnotations };

function computeAdditionalAnnotations(
  document: documentType,
  previousAnnotations: annotationType[],
  category: string,
) {
  if (!document.decisionMetadata.additionalTermsToAnnotate) {
    return [];
  }
  const annotationTerms = documentModule.lib.extractAdditionalAnnotationTerms(
    document.decisionMetadata.additionalTermsToAnnotate,
  );
  const additionalAnnotationsTextAndIndices = flatten(
    annotationTerms.map((annotationTerm) =>
      annotationTextDetector.detectAnnotationTextsAndIndices({
        documentText: document.text,
        annotationText: annotationTerm,
        annotations: previousAnnotations,
      }),
    ),
  );
  return annotationModule.lib.removeOverlappingAnnotations(
    additionalAnnotationsTextAndIndices.map(({ text, index }) =>
      annotationModule.lib.buildAnnotation({ start: index, text, category }),
    ),
  );
}
