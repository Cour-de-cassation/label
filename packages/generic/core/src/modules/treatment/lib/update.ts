import { settingsType } from '../../settings';
import { treatmentType } from '../treatmentType';
import { computeTreatmentInfo } from './computeTreatmentInfo';

export { update };

function update(
  treatment: treatmentType,
  treatmentFields: Partial<treatmentType>,
  settings: settingsType,
): treatmentType {
  const newTreatment = { ...treatment, ...treatmentFields };
  const {
    additionsCount,
    deletionsCount,
    modificationsCount,
    resizedBiggerCount,
    resizedSmallerCount,
  } = computeTreatmentInfo(newTreatment, settings);

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
