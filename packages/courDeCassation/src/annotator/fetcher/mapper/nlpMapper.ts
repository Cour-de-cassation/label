import { annotationType, annotationModule, documentType } from '@label/core';
import { nlpResponseType } from '../api';

export { nlpMapper };

const nlpMapper = {
  mapNlpAnnotationsToAnnotations,
  mapNlpAdditionalTerms,
};

function mapNlpAnnotationsToAnnotations(
  nlpAnnotations: nlpResponseType,
  document: documentType,
): annotationType[] {
  return nlpAnnotations.entities.map((nlpAnnotation) =>
    annotationModule.lib.buildAnnotation({
      category: nlpAnnotation.category,
      entityId: nlpAnnotation.entityId,
      start: nlpAnnotation.start,
      certaintyScore: nlpAnnotation.score,
      text: document.text.substring(nlpAnnotation.start, nlpAnnotation.end),
    }),
  );
}

function mapNlpAdditionalTerms(
  nlpResponse: nlpResponseType,
): documentType['decisionMetadata']['computedAdditionalTerms'] {
  if (
    nlpResponse.additionalTermsToAnnotate !== undefined ||
    nlpResponse.additionalTermsToUnAnnotate !== undefined
  ) {
    const additionalTermsToAnnotate =
      nlpResponse.additionalTermsToAnnotate == undefined
        ? []
        : nlpResponse.additionalTermsToAnnotate;
    const additionalTermsToUnAnnotate =
      nlpResponse.additionalTermsToUnAnnotate == undefined
        ? []
        : nlpResponse.additionalTermsToUnAnnotate;
    return {
      additionalTermsToAnnotate,
      additionalTermsToUnAnnotate,
    };
  } else {
    return;
  }
}
