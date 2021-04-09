import { annotationsDiffModule } from '../../annotationsDiff';
import { idModule } from '../../id';
import { treatmentType } from '../treatmentType';

export { computeTreatmentsInfo, computeTreatmentInfo };

export type { treatmentInfoType };

type treatmentInfoType = {
  additionsCount: number;
  deletionsCount: number;
  modificationsCount: number;
  resizedSmallerCount: number;
  resizedBiggerCount: number;
};

function computeTreatmentsInfo(treatments: treatmentType[]) {
  return treatments.reduce((accumulator, treatment) => {
    const treatmentInfo = computeTreatmentInfo(treatment);
    return {
      ...accumulator,
      [idModule.lib.convertToString(treatment._id)]: treatmentInfo,
    };
  }, {} as Record<string, treatmentInfoType>);
}

function computeTreatmentInfo(treatment: treatmentType) {
  const {
    addedAnnotations,
    categoryChangedAnnotations,
    deletedAnnotations,
    resizedBiggerAnnotations,
    resizedSmallerAnnotations,
  } = annotationsDiffModule.lib.computeDetailsFromAnnotationsDiff(treatment.annotationsDiff);

  return {
    additionsCount: addedAnnotations.length,
    deletionsCount: deletedAnnotations.length,
    modificationsCount: categoryChangedAnnotations.length,
    resizedSmallerCount: resizedSmallerAnnotations.length,
    resizedBiggerCount: resizedBiggerAnnotations.length,
  };
}
