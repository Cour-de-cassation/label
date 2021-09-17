import { aggregate } from './aggregate';
import { assertTreatmentsSourcesFollowRightOrder } from './assertTreatmentsSourcesFollowRightOrder';
import { build } from './build';
import { buildEmpty } from './buildEmpty';
import { extractHumanTreatments } from './extractHumanTreatments';
import { getLastTreatment } from './getLastTreatment';
import { computeAnnotations, computeAnnotationsDiff } from './computeAnnotations';
import { computeTreatmentInfo, treatmentInfoType } from './computeTreatmentInfo';
import { sortInConsistentOrder } from './sortInConsistentOrder';
import { update } from './update';

export {
  aggregate,
  assertTreatmentsSourcesFollowRightOrder,
  build,
  buildEmpty,
  computeAnnotations,
  computeAnnotationsDiff,
  computeTreatmentInfo,
  extractHumanTreatments,
  getLastTreatment,
  sortInConsistentOrder,
  update,
};

export type { treatmentInfoType };
