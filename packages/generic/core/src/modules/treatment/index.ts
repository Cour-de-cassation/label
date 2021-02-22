import { treatmentGenerator } from './generator';
import { treatmentDataModel, treatmentType } from './treatmentType';
import { buildTreatment, computeAnnotations, computeTreatmentsInfo } from './lib';

export { treatmentModule };

export type { treatmentType };

const treatmentModule = {
  dataModel: treatmentDataModel,
  generator: treatmentGenerator,
  lib: {
    buildTreatment,
    computeAnnotations,
    computeTreatmentsInfo,
  },
};
