import {
  annotationType,
  buildMongoId,
  documentType,
  annotationEntityModule,
  annotationReportType,
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
  return nlpAnnotations.entities.map(nlpAnnotation => ({
    annotationEntity: annotationEntityModule.lib.buildAnnotationEntity(
      nlpAnnotation.label,
    ),
    documentId: document._id,
    _id: buildMongoId(),
    source: nlpAnnotation.source,
    start: nlpAnnotation.start,
    text: nlpAnnotation.text,
  }));
}

function mapNlpAnnotationstoReport(
  nlpAnnotations: nlpAnnotationsType,
  document: documentType,
): annotationReportType {
  return {
    checkList: nlpAnnotations.checklist,
    checkNeeded: nlpAnnotations.check_needed,
    documentId: document._id,
    _id: buildMongoId(),
  };
}
