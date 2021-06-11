import { annotationOverlapDetector } from '../../../lib/annotationOverlapDetector';
import { annotationModule, annotationType } from '../../annotation';
import { annotationsDiffType } from '../annotationsDiffType';

export { areAnnotationsDiffCompatibleWithAnnotations };

function areAnnotationsDiffCompatibleWithAnnotations(
  previousAnnotations: annotationType[],
  annotationsDiff: annotationsDiffType,
) {
  const filteredPreviousAnnotations = previousAnnotations.filter((previousAnnotation) =>
    isAnnotationNotInArray(previousAnnotation, annotationsDiff.before),
  );

  return annotationsDiff.after.every((afterAnnotation) => {
    return !annotationOverlapDetector.isAnnotationTextOverlappedWithAnyAnnotations(
      filteredPreviousAnnotations,
      afterAnnotation.start,
      afterAnnotation.text,
    );
  });
}

function isAnnotationNotInArray(annotation: annotationType, annotations: annotationType[]) {
  return !annotations.some((otherAnnotation) => annotationModule.lib.comparator.equal(annotation, otherAnnotation));
}
