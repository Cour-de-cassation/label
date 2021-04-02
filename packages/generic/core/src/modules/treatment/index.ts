import { treatmentGenerator } from './generator';
import { treatmentModel, treatmentType } from './treatmentType';
import {
  buildTreatment,
  computeAnnotations,
  computeTreatmentInfo,
  computeTreatmentsInfo,
  treatmentInfoType,
} from './lib';

export { treatmentModule };

export type { treatmentType, treatmentInfoType };

const treatmentModule = {
  model: treatmentModel,
  generator: treatmentGenerator,
  lib: {
    buildTreatment,
    computeAnnotations,
    computeTreatmentInfo,
    computeTreatmentsInfo,
  },
};
