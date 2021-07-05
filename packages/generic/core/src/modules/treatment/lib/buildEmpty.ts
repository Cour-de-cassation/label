import { idModule, omitIdType } from '../../id';
import { treatmentGenerator } from '../generator';
import { treatmentType } from '../treatmentType';

export { buildEmpty };

function buildEmpty(
  treatmentFields: Omit<
    omitIdType<treatmentType>,
    | 'addedAnnotationsCount'
    | 'deletedAnnotationsCount'
    | 'duration'
    | 'lastUpdateDate'
    | 'modifiedAnnotationsCount'
    | 'resizedBiggerAnnotationsCount'
    | 'resizedSmallerAnnotationsCount'
  >,
): treatmentType {
  const treatment = treatmentGenerator.generate(treatmentFields);

  return {
    ...treatment,
    _id: idModule.lib.buildId(),
    addedAnnotationsCount: { sensitive: 0, other: 0 },
    deletedAnnotationsCount: { anonymised: 0, other: 0 },
    duration: 0,
    lastUpdateDate: new Date().getTime(),
    modifiedAnnotationsCount: 0,
    resizedBiggerAnnotationsCount: 0,
    resizedSmallerAnnotationsCount: 0,
  };
}
