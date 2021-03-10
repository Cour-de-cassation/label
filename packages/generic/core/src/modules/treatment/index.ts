import { treatmentGenerator } from './generator';
import { treatmentDataModel, treatmentType } from './treatmentType';
import { buildTreatment, computeAnnotations, computeTreatmentsInfo, treatmentInfoType } from './lib';

export { treatmentModule };

export type { treatmentType, treatmentInfoType };

const treatmentModule = {
  dataModel: treatmentDataModel,
  generator: treatmentGenerator,
  lib: {
    buildTreatment,
    computeAnnotations,
    computeTreatmentsInfo,
  },
};
