import {
  annotationType,
  annotationModule,
  documentType,
  annotationReportType,
  annotationReportModule,
} from '@label/core';
import { nlpAnnotationsType } from '../api';

export { nlpMapper };

const nlpMapper = {
  mapNlpAnnotationsToAnnotations,
  mapNlpAnnotationstoReport,
};

function mapNlpAnnotationsToAnnotations(
  nlpAnnotations: nlpAnnotationsType,
  document: documentType,
): annotationType[] {
  return nlpAnnotations.entities.map((nlpAnnotation) =>
    annotationModule.lib.buildAnnotation({
      category: nlpAnnotation.label,
      start: nlpAnnotation.start,
      certaintyScore: nlpAnnotation.score,
      text: document.text.substring(nlpAnnotation.start, nlpAnnotation.end),
    }),
  );
}

function mapNlpAnnotationstoReport(
  nlpAnnotations: nlpAnnotationsType,
  document: documentType,
): annotationReportType {
  return annotationReportModule.lib.buildAnnotationReport({
    checklist: nlpAnnotations.checklist,
    documentId: document._id,
  });
}
