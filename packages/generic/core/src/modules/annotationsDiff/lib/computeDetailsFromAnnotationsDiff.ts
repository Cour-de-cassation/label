import { annotationModule, annotationType } from '../../annotation';
import { annotationsDiffType } from '../annotationsDiffType';

export { computeDetailsFromAnnotationsDiff };

function computeDetailsFromAnnotationsDiff(annotationsDiff: annotationsDiffType) {
  const deletedAnnotations = computeDeletedAnnotations(annotationsDiff);
  const addedAnnotations = computeAddedAnnotations(annotationsDiff);
  const {
    resizedBiggerAnnotations,
    resizedSmallerAnnotations,
    strictlyModifiedAnnotations,
  } = computeModifiedAnnotations(annotationsDiff);

  return {
    addedAnnotations,
    deletedAnnotations,
    strictlyModifiedAnnotations,
    resizedBiggerAnnotations,
    resizedSmallerAnnotations,
  };
}

function computeDeletedAnnotations(annotationsDiff: annotationsDiffType): annotationType[] {
  return annotationsDiff.before.filter((beforeAnnotation) =>
    annotationsDiff.after.every(
      (afterAnnotation) =>
        !annotationModule.lib.comparator.equalModuloCategory(beforeAnnotation, afterAnnotation) &&
        !annotationModule.lib.areOverlapping(beforeAnnotation, afterAnnotation),
    ),
  );
}

function computeAddedAnnotations(annotationsDiff: annotationsDiffType): annotationType[] {
  return annotationsDiff.after.filter((afterAnnotation) =>
    annotationsDiff.before.every(
      (beforeAnnotation) =>
        !annotationModule.lib.comparator.equalModuloCategory(beforeAnnotation, afterAnnotation) &&
        !annotationModule.lib.areOverlapping(beforeAnnotation, afterAnnotation),
    ),
  );
}

function computeModifiedAnnotations(
  annotationsDiff: annotationsDiffType,
): {
  strictlyModifiedAnnotations: Array<[annotationType, annotationType]>;
  resizedBiggerAnnotations: Array<[annotationType, annotationType]>;
  resizedSmallerAnnotations: Array<[annotationType, annotationType]>;
} {
  const resizedBiggerAnnotations = computeResizedBiggerAnnotations(annotationsDiff);
  const resizedSmallerAnnotations = computeResizedSmallerAnnotations(annotationsDiff);
  const strictlyModifiedAnnotations = computeStrictlyModifiedAnnotations(annotationsDiff);

  return { strictlyModifiedAnnotations, resizedBiggerAnnotations, resizedSmallerAnnotations };
}

function computeResizedBiggerAnnotations(
  annotationsDiff: annotationsDiffType,
): Array<[annotationType, annotationType]> {
  return annotationsDiff.before.reduce((resizedBiggerAnnotations, beforeAnnotation) => {
    const resizedBiggerAnnotation = annotationsDiff.after.find(
      (afterAnnotation) =>
        annotationModule.lib.areOverlapping(beforeAnnotation, afterAnnotation) &&
        !annotationModule.lib.comparator.equalModuloCategory(beforeAnnotation, afterAnnotation),
    );

    if (!resizedBiggerAnnotation || beforeAnnotation.text.length >= resizedBiggerAnnotation.text.length) {
      return resizedBiggerAnnotations;
    } else {
      return [
        ...resizedBiggerAnnotations,
        [beforeAnnotation, resizedBiggerAnnotation] as [annotationType, annotationType],
      ];
    }
  }, [] as Array<[annotationType, annotationType]>);
}

function computeResizedSmallerAnnotations(
  annotationsDiff: annotationsDiffType,
): Array<[annotationType, annotationType]> {
  return annotationsDiff.before.reduce((resizedSmallerAnnotations, beforeAnnotation) => {
    const resizedSmallerAnnotation = annotationsDiff.after.find(
      (afterAnnotation) =>
        annotationModule.lib.areOverlapping(beforeAnnotation, afterAnnotation) &&
        !annotationModule.lib.comparator.equalModuloCategory(beforeAnnotation, afterAnnotation),
    );

    if (!resizedSmallerAnnotation || beforeAnnotation.text.length < resizedSmallerAnnotation.text.length) {
      return resizedSmallerAnnotations;
    } else {
      return [
        ...resizedSmallerAnnotations,
        [beforeAnnotation, resizedSmallerAnnotation] as [annotationType, annotationType],
      ];
    }
  }, [] as Array<[annotationType, annotationType]>);
}

function computeStrictlyModifiedAnnotations(
  annotationsDiff: annotationsDiffType,
): Array<[annotationType, annotationType]> {
  return annotationsDiff.before.reduce((modifiedAnnotations, beforeAnnotation) => {
    const strictlyModifiedAnnotation = annotationsDiff.after.find((afterAnnotation) =>
      annotationModule.lib.comparator.equalModuloCategory(beforeAnnotation, afterAnnotation),
    );

    if (!strictlyModifiedAnnotation) {
      return modifiedAnnotations;
    } else {
      return [
        ...modifiedAnnotations,
        [beforeAnnotation, strictlyModifiedAnnotation] as [annotationType, annotationType],
      ];
    }
  }, [] as Array<[annotationType, annotationType]>);
}
