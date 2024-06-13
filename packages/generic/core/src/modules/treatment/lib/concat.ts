import { treatmentType } from '..';
import { labelTreatmentsType } from 'sder';
import { computeAnnotations } from './computeAnnotations';
import { documentType } from '../../document/documentType';

export { concat };

function concat(treatments: treatmentType[], nlpVersions?: documentType['nlpVersions']): labelTreatmentsType {
  const labelTreatments = [];

  const sortedTreatments = treatments.sort((treatment1, treatment2) => treatment1.order - treatment2.order);

  while (sortedTreatments.length > 0) {
    const order = sortedTreatments.length;

    labelTreatments.unshift({
      annotations: computeAnnotations(sortedTreatments),
      source: computeSource(order),
      order,
      nlpVersions: computeSource(order) == 'NLP' ? nlpVersions : undefined,
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
