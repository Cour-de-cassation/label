import { annotationOverlapDetector } from '../../../lib';
import { annotationType } from '../../annotation';
import { annotationsDiffModule } from '../../annotationsDiff';
import { treatmentType } from '../treatmentType';
import { computeAnnotations } from './computeAnnotations';

export { areAnnotationsConsistent };

function areAnnotationsConsistent(previousTreatments: treatmentType[], treatment: treatmentType) {
  const previousAnnotations = computeAnnotations(previousTreatments);

  const { addedAnnotations, resizedBiggerAnnotations } = annotationsDiffModule.lib.computeDetailsFromAnnotationsDiff(
    treatment.annotationsDiff,
  );

  if (
    areNewAnnotationsOverlappingPreviousAnnotations(previousAnnotations, { addedAnnotations, resizedBiggerAnnotations })
  ) {
    return false;
  }

  return true;
}

function areNewAnnotationsOverlappingPreviousAnnotations(
  previousAnnotations: annotationType[],
  {
    addedAnnotations,
    resizedBiggerAnnotations,
  }: { addedAnnotations: annotationType[]; resizedBiggerAnnotations: [annotationType, annotationType][] },
) {
  const nextAnnotations = [
    ...addedAnnotations,
    ...resizedBiggerAnnotations.map((resizedBiggerAnnotation) => resizedBiggerAnnotation[1]),
  ];
  return nextAnnotations.some((nextAnnotation) =>
    annotationOverlapDetector.isAnnotationTextOverlappedWithAnyAnnotations(
      previousAnnotations,
      nextAnnotation.start,
      nextAnnotation.text,
    ),
  );
}
