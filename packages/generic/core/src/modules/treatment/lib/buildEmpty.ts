import { idModule, omitIdType } from '../../id';
import { treatmentGenerator } from '../generator';
import { treatmentType } from '../treatmentType';

export { buildEmpty };

function buildEmpty(
  treatmentFields: Omit<
    omitIdType<treatmentType>,
    | 'duration'
    | 'lastUpdateDate'
    | 'subAnnotationsSensitiveCount'
    | 'subAnnotationsNonSensitiveCount'
    | 'surAnnotationsCount'
  >,
): treatmentType {
  const treatment = treatmentGenerator.generate(treatmentFields);

  return {
    ...treatment,
    _id: idModule.lib.buildId(),
    subAnnotationsSensitiveCount: 0,
    surAnnotationsCount: 0,
    subAnnotationsNonSensitiveCount: 0,
    duration: 0,
    lastUpdateDate: new Date().getTime(),
  };
}
