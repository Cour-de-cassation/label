import { annotationType } from '../../annotation';
import { annotationsDiffModule } from '../../annotationsDiff';
import { idModule } from '../../id';
import { treatmentType } from '../treatmentType';

export { computeAnnotations };

function computeAnnotations(treatments: treatmentType[]): annotationType[] {
  const sortedTreatments = sortTreatments(treatments);

  if (checkTreatmentsConsistency(sortedTreatments)) {
    const annotationsDiffs = sortedTreatments.map((treatment) => treatment.annotationsDiff);
    return annotationsDiffModule.lib.squash(annotationsDiffs).after;
  } else {
    throw new Error('Can not compute annotations from inconsistent treatments');
  }
}

function sortTreatments(treatments: treatmentType[]): treatmentType[] {
  return treatments.sort((treatment1, treatment2) => treatment1.order - treatment2.order);
}

function checkTreatmentsConsistency(treatments: treatmentType[]): boolean {
  return (
    areOnTheSameDocument(treatments) && haveConsistentOrder(treatments) && areAnnotationsInitiallyEmpty(treatments)
  );
}

function areOnTheSameDocument(treatments: treatmentType[]): boolean {
  return treatments.every((treatment) => idModule.lib.equalId(treatment.documentId, treatments[0].documentId));
}

function haveConsistentOrder(treatments: treatmentType[]): boolean {
  return treatments.reduce(
    (hasConsistentOrder, treatment, index) => hasConsistentOrder && treatment.order === index,
    true as boolean,
  );
}

function areAnnotationsInitiallyEmpty(treatments: treatmentType[]): boolean {
  return treatments[0].annotationsDiff.before.length === 0;
}
