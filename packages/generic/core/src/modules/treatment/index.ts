import { treatmentGenerator } from './generator';
import { treatmentModel, treatmentType } from './treatmentType';
import {
  aggregateTreatmentInfo,
  assertTreatmentsSourcesFollowRightOrder,
  build,
  buildEmpty,
  computeAnnotations,
  computeAnnotationsDiff,
  computeTreatmentInfo,
  extractHumanTreatments,
  extractLastUpdateDate,
  getLastTreatment,
  incrementTreatmentDuration,
  treatmentInfoType,
  sortInConsistentOrder,
  update,
} from './lib';

export { treatmentModule };

export type { treatmentType, treatmentInfoType };

const treatmentModule = {
  model: treatmentModel,
  generator: treatmentGenerator,
  lib: {
    aggregateTreatmentInfo,
    assertTreatmentsSourcesFollowRightOrder,
    build,
    buildEmpty,
    computeAnnotations,
    computeAnnotationsDiff,
    computeTreatmentInfo,
    extractHumanTreatments,
    extractLastUpdateDate,
    getLastTreatment,
    incrementTreatmentDuration,
    sortInConsistentOrder,
    update,
  },
};
