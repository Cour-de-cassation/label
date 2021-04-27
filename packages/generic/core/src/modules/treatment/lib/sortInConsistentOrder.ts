import { treatmentType } from '../treatmentType';

export { sortInConsistentOrder };

function sortInConsistentOrder(treatments: treatmentType[]): treatmentType[] {
  return [...treatments].sort((treatment1, treatment2) => treatment1.order - treatment2.order);
}
