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
  const { subAnnotationsSensitiveCount, surAnnotationsCount, subAnnotationsNonSensitiveCount } = computeTreatmentInfo(
    newTreatment.annotationsDiff,
    settings,
  );

  return {
    ...newTreatment,
    subAnnotationsNonSensitiveCount,
    surAnnotationsCount,
    subAnnotationsSensitiveCount,
    lastUpdateDate: new Date().getTime(),
  };
}
