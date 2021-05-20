import { treatmentType } from '../treatmentType';
import { sortInConsistentOrder } from './sortInConsistentOrder';

export { getLastTreatment };

function getLastTreatment(treatments: treatmentType[]) {
  if (treatments.length === 0) {
    return undefined;
  }

  return sortInConsistentOrder(treatments)[treatments.length - 1];
}
