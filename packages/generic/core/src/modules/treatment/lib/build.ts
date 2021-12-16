import { settingsType } from '../../../modules/settings';
import { idModule, omitIdType } from '../../id';
import { treatmentGenerator } from '../generator';
import { treatmentType } from '../treatmentType';
import { computeTreatmentInfo } from './computeTreatmentInfo';

export { build };

function build(
  treatmentFields: Omit<
    omitIdType<treatmentType>,
    | 'duration'
    | 'lastUpdateDate'
    | 'subAnnotationsSensitiveCount'
    | 'subAnnotationsNonSensitiveCount'
    | 'surAnnotationsCount'
  >,
  settings: settingsType,
): treatmentType {
  const treatment = treatmentGenerator.generate(treatmentFields);
  const { subAnnotationsSensitiveCount, surAnnotationsCount, subAnnotationsNonSensitiveCount } = computeTreatmentInfo(
    treatmentFields.annotationsDiff,
    settings,
  );

  return {
    ...treatment,
    _id: idModule.lib.buildId(),
    subAnnotationsNonSensitiveCount,
    surAnnotationsCount,
    subAnnotationsSensitiveCount,
    duration: 0,
    lastUpdateDate: new Date().getTime(),
  };
}
