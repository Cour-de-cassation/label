import { treatmentGenerator } from './generator';
import { treatmentModel, treatmentType } from './treatmentType';
import {
  build,
  areAnnotationsConsistent,
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
    areAnnotationsConsistent,
    build,
    computeAnnotations,
    computeAnnotationsDiff,
    computeTreatmentInfo,
    getLastTreatment,
    sortInConsistentOrder,
    update,
  },
};
