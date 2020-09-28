import {
  annotationType,
  buildMongoId,
  courtDecisionType,
  annotationEntityModule,
  nlpReportType,
} from '@label/core';
import { nlpEngineCourtDecisionAnnotationsType } from '../api';

export { nlpEngineMapper };

const nlpEngineMapper = {
  mapNlpEngineAnnotationstoAnnotations,
  mapNlpEngineAnnotationstoReport,
};

function mapNlpEngineAnnotationstoAnnotations(
  nlpEngineAnnotations: nlpEngineCourtDecisionAnnotationsType,
  courtDecision: courtDecisionType,
): annotationType[] {
  return nlpEngineAnnotations.entities.map(nlpEngineAnnotation => ({
    annotationEntity: annotationEntityModule.lib.buildAnnotationEntity(
      nlpEngineAnnotation.label,
    ),
    courtDecisionId: courtDecision._id,
    _id: buildMongoId(),
    source: nlpEngineAnnotation.source,
    start: nlpEngineAnnotation.start,
    text: nlpEngineAnnotation.text,
  }));
}

function mapNlpEngineAnnotationstoReport(
  nlpEngineAnnotations: nlpEngineCourtDecisionAnnotationsType,
  courtDecision: courtDecisionType,
): nlpReportType {
  return {
    checkList: nlpEngineAnnotations.checklist,
    checkNeeded: nlpEngineAnnotations.check_needed,
    courtDecisionId: courtDecision._id,
    _id: buildMongoId(),
  };
}
