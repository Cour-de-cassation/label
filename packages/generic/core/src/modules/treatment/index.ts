import { treatmentGenerator } from './generator';
import { treatmentModel, treatmentType } from './treatmentType';
import {
  build,
  computeAnnotations,
  computeTreatmentInfo,
  computeTreatmentsInfo,
  treatmentInfoType,
  update,
} from './lib';

export { treatmentModule };

export type { treatmentType, treatmentInfoType };

const treatmentModule = {
  model: treatmentModel,
  generator: treatmentGenerator,
  lib: {
    build,
    computeAnnotations,
    computeTreatmentInfo,
    computeTreatmentsInfo,
    update,
  },
};
