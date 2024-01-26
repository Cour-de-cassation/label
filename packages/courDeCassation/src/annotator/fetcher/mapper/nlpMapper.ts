import {
  annotationType,
  annotationModule,
  documentType,
  annotationReportType,
  annotationReportModule,
} from '@label/core';
import { nlpResponseType } from '../api';

export { nlpMapper };

const nlpMapper = {
  mapNlpAnnotationsToAnnotations,
  mapNlpAnnotationstoReport,
};

function mapNlpAnnotationsToAnnotations(
  nlpAnnotations: nlpResponseType,
  document: documentType,
): annotationType[] {
  return nlpAnnotations.entities.map((nlpAnnotation) =>
    annotationModule.lib.buildAnnotation({
      category: nlpAnnotation.label,
      entityId: nlpAnnotation.entityId,
      start: nlpAnnotation.start,
      certaintyScore: nlpAnnotation.score,
      text: document.text.substring(nlpAnnotation.start, nlpAnnotation.end),
    }),
  );
}

function mapNlpAnnotationstoReport(
  nlpAnnotations: nlpResponseType,
  document: documentType,
): annotationReportType {
  return annotationReportModule.lib.buildAnnotationReport({
    checklist: nlpAnnotations.checklist,
    documentId: document._id,
  });
}

//add nlp mapper for additionalTerms and for newCategoriesToOmit
