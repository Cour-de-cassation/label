import { idModule, omitIdType } from '../../id';
import { treatmentGenerator } from '../generator';
import { treatmentType } from '../treatmentType';
import { computeTreatmentInfo } from './computeTreatmentInfo';

export { build };

function build(
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
  const {
    additionsCount,
    deletionsCount,
    modificationsCount,
    resizedBiggerCount,
    resizedSmallerCount,
  } = computeTreatmentInfo(treatment);

  return {
    ...treatment,
    _id: idModule.lib.buildId(),
    addedAnnotationsCount: additionsCount,
    deletedAnnotationsCount: deletionsCount,
    duration: 0,
    lastUpdateDate: new Date().getTime(),
    modifiedAnnotationsCount: modificationsCount,
    resizedBiggerAnnotationsCount: resizedBiggerCount,
    resizedSmallerAnnotationsCount: resizedSmallerCount,
  };
}
