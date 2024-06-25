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
      source: computeSource(sortedTreatments[order - 1].source),
      order,
      version: sortedTreatments[order - 1].source === 'NLP' ? nlpVersions : undefined,
    });
    sortedTreatments.pop();
  }

  // Reimported treatment are already in sder database
  const labelTreatmentsWithoutReimported = labelTreatments.filter(
    (labelTreatment) => labelTreatment.source != 'REIMPORTED_TREATMENT',
  );

  return labelTreatmentsWithoutReimported;

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
