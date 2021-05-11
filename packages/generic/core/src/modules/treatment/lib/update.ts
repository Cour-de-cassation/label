import { treatmentType } from '../treatmentType';
import { computeTreatmentInfo } from './computeTreatmentInfo';

export { update };

function update(treatment: treatmentType, treatmentFields: Partial<treatmentType>): treatmentType {
  const newTreatment = { ...treatment, ...treatmentFields };
  const {
    additionsCount,
    deletionsCount,
    modificationsCount,
    resizedBiggerCount,
    resizedSmallerCount,
  } = computeTreatmentInfo(newTreatment);

  return {
    ...newTreatment,
    addedAnnotationsCount: additionsCount,
    deletedAnnotationsCount: deletionsCount,
    lastUpdateDate: new Date().getTime(),
    modifiedAnnotationsCount: modificationsCount,
    resizedBiggerAnnotationsCount: resizedBiggerCount,
    resizedSmallerAnnotationsCount: resizedSmallerCount,
  };
}
