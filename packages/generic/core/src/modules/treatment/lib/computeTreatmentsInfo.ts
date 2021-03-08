import { annotationOverlapDetector } from '../../../lib/annotationOverlapDetector';
import { annotationType } from '../../../modules/annotation';
import { idModule } from '../../../modules/id';
import { treatmentType } from '../treatmentType';

export { computeTreatmentsInfo, computeTreatmentInfo };

type treatmentInfoType = {
  additionsCount: number;
  deletionsCount: number;
  modificationsCount: number;
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
  let beforeAnnotations = treatment.annotationsDiff.before;
  let afterAnnotations = treatment.annotationsDiff.after;
  const { deletionsCount, currentModificationsCount } = treatment.annotationsDiff.before.reduce(
    ({ deletionsCount, currentModificationsCount }, annotation) => {
      const correspondingAnnotation = findCorrespondingAnnotation(annotation, afterAnnotations);
      if (!!correspondingAnnotation) {
        beforeAnnotations = beforeAnnotations.filter((beforeAnnotation) => beforeAnnotation !== annotation);
        afterAnnotations = afterAnnotations.filter((afterAnnotation) => afterAnnotation !== correspondingAnnotation);
        return { deletionsCount, currentModificationsCount: currentModificationsCount + 1 };
      }
      return { deletionsCount: deletionsCount + 1, currentModificationsCount };
    },
    { deletionsCount: 0, currentModificationsCount: 0 },
  );
  const { additionsCount, modificationsCount } = afterAnnotations.reduce(
    ({ additionsCount, modificationsCount }, annotation) => {
      const correspondingAnnotation = findCorrespondingAnnotation(annotation, beforeAnnotations);
      if (!!correspondingAnnotation) {
        return { additionsCount, modificationsCount: modificationsCount + 1 };
      }
      return { additionsCount: additionsCount + 1, modificationsCount };
    },
    { additionsCount: 0, modificationsCount: currentModificationsCount },
  );
  return {
    additionsCount,
    deletionsCount,
    modificationsCount,
  };
}

function findCorrespondingAnnotation(annotation: annotationType, annotations: annotationType[]) {
  return annotationOverlapDetector.findOverlappingAnnotation(annotations, annotation.start, annotation.text);
}
