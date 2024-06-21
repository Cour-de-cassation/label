import { treatmentType } from '..';
import { labelTreatmentsType } from 'sder';
import { computeAnnotations } from './computeAnnotations';
import { documentType } from '../../document/documentType';

export { concat };

function concat(treatments: treatmentType[], nlpVersions?: documentType['nlpVersions']): labelTreatmentsType {
  const labelTreatments = [];

  const sortedTreatments = treatments.sort((treatment1, treatment2) => treatment1.order - treatment2.order);

  // Reimported treatment are already in sder database
  const treatmentsWithoutReimported = sortedTreatments.filter((treatment) => {
    treatment.source != 'reimportedTreatment';
  });

  while (treatmentsWithoutReimported.length > 0) {
    const order = treatmentsWithoutReimported.length;

    labelTreatments.unshift({
      annotations: computeAnnotations(treatmentsWithoutReimported),
      source: computeSource(treatmentsWithoutReimported[order - 1].source),
      order,
      version: treatmentsWithoutReimported[order - 1].source === 'NLP' ? nlpVersions : undefined,
    });
    treatmentsWithoutReimported.pop();
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
      default:
        return 'LABEL_AUTO_TREATMENT';
    }
  }
}
