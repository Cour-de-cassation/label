import { treatmentType } from '../treatmentType';

export { extractLastUpdateDate };

function extractLastUpdateDate(treatments: treatmentType[]) {
  if (treatments.length === 0) {
    throw new Error(`Cannot compute last update date of empty treatments`);
  }

  return Math.max(...treatments.map((treatment) => treatment.lastUpdateDate));
}
