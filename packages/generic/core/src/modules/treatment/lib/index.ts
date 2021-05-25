import { areAnnotationsConsistent } from './areAnnotationsConsistent';
import { build } from './build';
import { getLastTreatment } from './getLastTreatment';
import { computeAnnotations, computeAnnotationsDiff } from './computeAnnotations';
import { computeTreatmentInfo, treatmentInfoType } from './computeTreatmentInfo';
import { sortInConsistentOrder } from './sortInConsistentOrder';
import { update } from './update';

export {
  areAnnotationsConsistent,
  build,
  computeAnnotations,
  computeAnnotationsDiff,
  computeTreatmentInfo,
  getLastTreatment,
  sortInConsistentOrder,
  update,
};

export type { treatmentInfoType };
