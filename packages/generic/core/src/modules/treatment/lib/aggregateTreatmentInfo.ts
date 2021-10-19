import { annotationsDiffModule } from '../../annotationsDiff';
import { settingsType } from '../../settings';
import { treatmentType } from '../treatmentType';
import { assertTreatmentsSameDocumentId } from './assertTreatmentsSameDocumentId';
import { computeTreatmentInfo, treatmentInfoType } from './computeTreatmentInfo';
import { sortInConsistentOrder } from './sortInConsistentOrder';

export { aggregateTreatmentInfo };

function aggregateTreatmentInfo(treatments: treatmentType[], settings: settingsType): treatmentInfoType {
  if (treatments.length === 0) {
    return {
      subAnnotationsNonSensitiveCount: 0,
      subAnnotationsSensitiveCount: 0,
      surAnnotationsCount: 0,
    };
  }
  assertTreatmentsSameDocumentId(treatments);
  const sortedTreatments = sortInConsistentOrder(treatments);

  const annotationsDiff = annotationsDiffModule.lib.squash(
    sortedTreatments.map((treatment) => treatment.annotationsDiff),
  );
  const treatmentInfo = computeTreatmentInfo(annotationsDiff, settings);
  return treatmentInfo;
}
