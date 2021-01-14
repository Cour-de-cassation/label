import { treatmentGenerator } from './generator';
import { treatmentDataModel, treatmentType, fetchedTreatmentType } from './treatmentType';
import { buildTreatment, computeAnnotations } from './lib';

export { treatmentModule };

export type { treatmentType, fetchedTreatmentType };

const treatmentModule = {
  dataModel: treatmentDataModel,
  generator: treatmentGenerator,
  lib: {
    buildTreatment,
    computeAnnotations,
  },
};
