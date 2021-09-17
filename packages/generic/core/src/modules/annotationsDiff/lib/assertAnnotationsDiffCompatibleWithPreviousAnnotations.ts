import { annotationOverlapDetector } from '../../../lib/annotationOverlapDetector';
import { annotationModule, annotationType } from '../../annotation';
import { annotationsDiffType } from '../annotationsDiffType';

export { assertAnnotationsDiffCompatibleWithPreviousAnnotations };

function assertAnnotationsDiffCompatibleWithPreviousAnnotations(
  previousAnnotations: annotationType[],
  annotationsDiff: annotationsDiffType,
  actionToPerform?: string,
) {
  const filteredPreviousAnnotations = previousAnnotations.filter((previousAnnotation) =>
    isAnnotationNotInArray(previousAnnotation, annotationsDiff.before),
  );

  const overlappingAnnotations = extractOverlappingCouple(annotationsDiff.after, filteredPreviousAnnotations);
  if (overlappingAnnotations) {
    const errorMessage = `${
      actionToPerform ? `Could not ${actionToPerform}: ` : ''
    }annotations diff previousAnnotation ${annotationModule.lib.stringify(
      overlappingAnnotations.previous,
    )} overlaps with afterAnnotation ${annotationModule.lib.stringify(overlappingAnnotations.after)}`;
    throw new Error(errorMessage);
  }
  return true;
}

function extractOverlappingCouple(afterAnnotations: annotationType[], previousAnnotations: annotationType[]) {
  for (const afterAnnotation of afterAnnotations) {
    const overlappingBeforeAnnotation = annotationOverlapDetector.findOverlappingAnnotation(
      previousAnnotations,
      afterAnnotation.start,
      afterAnnotation.text,
    );
    if (overlappingBeforeAnnotation) {
      return { after: afterAnnotation, previous: overlappingBeforeAnnotation };
    }
  }
}

function isAnnotationNotInArray(annotation: annotationType, annotations: annotationType[]) {
  return !annotations.some((otherAnnotation) => annotationModule.lib.comparator.equal(annotation, otherAnnotation));
}
