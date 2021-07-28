import { treatmentGenerator } from './generator';
import { treatmentModel, treatmentType } from './treatmentType';
import {
  aggregate,
  build,
  buildEmpty,
  computeAnnotations,
  computeAnnotationsDiff,
  computeTreatmentInfo,
  extractHumanTreatments,
  getLastTreatment,
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
    aggregate,
    build,
    buildEmpty,
    computeAnnotations,
    computeAnnotationsDiff,
    computeTreatmentInfo,
    extractHumanTreatments,
    getLastTreatment,
    sortInConsistentOrder,
    update,
  },
};
