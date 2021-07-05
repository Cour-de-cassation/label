import { treatmentGenerator } from './generator';
import { treatmentModel, treatmentType } from './treatmentType';
import {
  build,
  buildEmpty,
  computeAnnotations,
  computeAnnotationsDiff,
  computeTreatmentInfo,
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
    build,
    buildEmpty,
    computeAnnotations,
    computeAnnotationsDiff,
    computeTreatmentInfo,
    getLastTreatment,
    sortInConsistentOrder,
    update,
  },
};
