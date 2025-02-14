import { treatmentType } from '..';
import { computeAnnotations } from './computeAnnotations';
import { LabelTreatment } from 'dbsder-api-types';

export { concat };

function concat(treatments: treatmentType[]): LabelTreatment[] {
  const labelTreatments: LabelTreatment[] = [];

  const sortedTreatments = treatments.sort((treatment1, treatment2) => treatment1.order - treatment2.order);

  while (sortedTreatments.length > 0) {
    const order = sortedTreatments.length;
    const currentTreatment = sortedTreatments[order - 1];

    if (currentTreatment.source != 'reimportedTreatment' && currentTreatment.source != 'NLP') {
      labelTreatments.unshift({
        annotations: computeAnnotations(sortedTreatments),
        source: computeSource(currentTreatment.source),
        order,
        treatmentDate: new Date(currentTreatment.lastUpdateDate).toISOString(),
      });
    }
    sortedTreatments.pop();
  }

  // re-write order in case of skipped treatments (NLP or reimported)
  labelTreatments.forEach((labelTreatment, index) => {
    labelTreatment.order = index + 1;
  });

  return labelTreatments;

  function computeSource(source: treatmentType['source']) {
    switch (source) {
      case 'annotator':
      case 'admin':
        return 'LABEL_WORKING_USER_TREATMENT';
      default:
        return 'LABEL_AUTO_TREATMENT';
    }
  }
}
