import { aggregateTreatmentInfo } from './aggregateTreatmentInfo';
import { assertTreatmentsSourcesFollowRightOrder } from './assertTreatmentsSourcesFollowRightOrder';
import { build } from './build';
import { buildEmpty } from './buildEmpty';
import { concat } from './concat';
import { extractHumanTreatments } from './extractHumanTreatments';
import { extractLastUpdateDate } from './extractLastUpdateDate';
import { getLastTreatment } from './getLastTreatment';
import { getTimeThresholdToUpdateDuration } from './getTimeThresholdToUpdateDuration';
import { computeAnnotations, computeAnnotationsDiff } from './computeAnnotations';
import { computeTreatmentInfo, treatmentInfoType } from './computeTreatmentInfo';
import { sortInConsistentOrder } from './sortInConsistentOrder';
import { update } from './update';

export {
  aggregateTreatmentInfo,
  assertTreatmentsSourcesFollowRightOrder,
  build,
  buildEmpty,
  concat,
  computeAnnotations,
  computeAnnotationsDiff,
  computeTreatmentInfo,
  extractHumanTreatments,
  extractLastUpdateDate,
  getLastTreatment,
  getTimeThresholdToUpdateDuration,
  sortInConsistentOrder,
  update,
};

export type { treatmentInfoType };
