import { aggregateTreatmentInfo } from './aggregateTreatmentInfo';
import { assertTreatmentsSourcesFollowRightOrder } from './assertTreatmentsSourcesFollowRightOrder';
import { build } from './build';
import { buildEmpty } from './buildEmpty';
import { extractHumanTreatments } from './extractHumanTreatments';
import { extractLastUpdateDate } from './extractLastUpdateDate';
import { getLastTreatment } from './getLastTreatment';
import { computeAnnotations, computeAnnotationsDiff } from './computeAnnotations';
import { computeTreatmentInfo, treatmentInfoType } from './computeTreatmentInfo';
import { sortInConsistentOrder } from './sortInConsistentOrder';
import { update } from './update';

export {
  aggregateTreatmentInfo,
  assertTreatmentsSourcesFollowRightOrder,
  build,
  buildEmpty,
  computeAnnotations,
  computeAnnotationsDiff,
  computeTreatmentInfo,
  extractHumanTreatments,
  extractLastUpdateDate,
  getLastTreatment,
  sortInConsistentOrder,
  update,
};

export type { treatmentInfoType };
