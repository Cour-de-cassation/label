import { annotationsDiffModule } from '../../../modules/annotationsDiff';
import { idModule } from '../../../modules/id';
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
    deletedAnnotations,
    strictlyModifiedAnnotations,
    resizedBiggerAnnotations,
    resizedSmallerAnnotations,
  } = annotationsDiffModule.lib.computeDetailsFromAnnotationsDiff(treatment.annotationsDiff);

  return {
    additionsCount: addedAnnotations.length,
    deletionsCount: deletedAnnotations.length,
    modificationsCount: strictlyModifiedAnnotations.length,
    resizedSmallerCount: resizedSmallerAnnotations.length,
    resizedBiggerCount: resizedBiggerAnnotations.length,
  };
}
