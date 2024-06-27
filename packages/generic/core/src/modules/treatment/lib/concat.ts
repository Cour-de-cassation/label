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
    const currentTreatment = sortedTreatments[order - 1];

    if (currentTreatment.source != 'reimportedTreatment') {
      labelTreatments.unshift({
        annotations: computeAnnotations(sortedTreatments),
        source: computeSource(currentTreatment.source),
        order,
        version: currentTreatment.source == 'NLP' ? nlpVersions : undefined,
        treatmentDate: currentTreatment.lastUpdateDate,
      });
    }
    sortedTreatments.pop();
  }

  // re-write order in case of reimportedTreatment
  labelTreatments.forEach((labelTreatment, index) => {
    labelTreatment.order = index + 1;
  });

  return labelTreatments;

  function computeSource(source: treatmentType['source']) {
    switch (source) {
      case 'NLP':
        return 'NLP';
      case 'annotator':
        return 'LABEL_WORKING_USER_TREATMENT';
      case 'admin':
        return 'LABEL_ADMIN_USER_TREATMENT';
      default:
        return 'LABEL_AUTO_TREATMENT';
    }
  }
}
