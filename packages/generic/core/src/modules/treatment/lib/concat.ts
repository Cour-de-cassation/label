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
      source: computeSource(sortedTreatments[order - 1].source),
      order,
    });
    sortedTreatments.pop();
  }

  return labelTreatments;

  function computeSource(source: treatmentType['source']) {
    switch (source) {
      case 'NLP':
        return 'NLP';
      case 'annotator':
        return 'LABEL_WORKING_USER_TREATMENT';
      case 'admin':
        return 'LABEL_ADMIN_USER_TREATMENT';
      case 'reimportedTreatment':
        return 'REIMPORTED_TREATMENT';
      default:
        return 'LABEL_AUTO_TREATMENT';
    }
  }
}
