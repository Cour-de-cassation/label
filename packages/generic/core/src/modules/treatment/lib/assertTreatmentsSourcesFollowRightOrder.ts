import { treatmentType } from '../treatmentType';
import { sortInConsistentOrder } from './sortInConsistentOrder';

export { assertTreatmentsSourcesFollowRightOrder };

type documentStepType = { treatmentSource: treatmentType['source'][]; quantity: '0|1' | '1' | '1+' };

const DOCUMENT_STEPS: documentStepType[] = [
  { treatmentSource: ['NLP', 'reimportedTreatment'], quantity: '1' },
  { treatmentSource: ['supplementaryAnnotations'], quantity: '0|1' },
  { treatmentSource: ['postProcess'], quantity: '0|1' },
  { treatmentSource: ['admin', 'annotator'], quantity: '1+' },
];

function assertTreatmentsSourcesFollowRightOrder(treatments: treatmentType[]) {
  const sortedTreatments = sortInConsistentOrder(treatments);

  let stepIndex = 0;
  let treatmentIndex = 0;

  const errorMessage = `Treatment sources do not follow the pattern: [${sortedTreatments
    .map(({ source }) => source)
    .join(', ')}]`;
  while (stepIndex < DOCUMENT_STEPS.length && treatmentIndex < sortedTreatments.length) {
    const currentStep = DOCUMENT_STEPS[stepIndex];
    const currentTreatment = sortedTreatments[treatmentIndex];
    if (currentStep.quantity === '1') {
      if (!currentStep.treatmentSource.includes(currentTreatment.source)) {
        throw new Error(errorMessage);
      }
      treatmentIndex++;
      stepIndex++;
    } else if (currentStep.quantity === '0|1') {
      if (currentStep.treatmentSource.includes(currentTreatment.source)) {
        treatmentIndex++;
      }
      stepIndex++;
    } else {
      if (!currentStep.treatmentSource.includes(currentTreatment.source)) {
        throw new Error(errorMessage);
      }
      while (
        treatmentIndex + 1 < sortedTreatments.length &&
        currentStep.treatmentSource.includes(sortedTreatments[treatmentIndex + 1].source)
      ) {
        treatmentIndex++;
      }
      stepIndex++;
    }
  }

  return true;
}
