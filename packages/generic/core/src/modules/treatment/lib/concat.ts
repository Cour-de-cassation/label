import { treatmentType } from '..';
import { labelTreatmentsType } from 'sder';
import { computeAnnotations } from './computeAnnotations';

export { concat };

function concat(treatments: treatmentType[]): labelTreatmentsType {
  const labelTreatments = [];

  const sortedTreatments = treatments.sort((treatment1, treatment2) => treatment1.order - treatment2.order);

  while (sortedTreatments.length > 0) {
    const order = sortedTreatments.length;

    labelTreatments.unshift({
      annotations: computeAnnotations(sortedTreatments),
      source: computeSource(order),
      order,
    });
    sortedTreatments.pop();
  }

  return labelTreatments;

  function computeSource(order: number) {
    switch (order) {
      case 1:
        return 'NLP';
      case 2:
        return 'LABEL_AUTO_TREATMENT';
      default:
        return 'LABEL_WORKING_USER_TREATMENT';
    }
  }
}
