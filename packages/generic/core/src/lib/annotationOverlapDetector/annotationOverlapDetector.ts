import { annotationModule, annotationType } from '../../modules/annotation';

export { annotationOverlapDetector };

const annotationOverlapDetector = {
  isAnnotationTextOverlappedWithAnyAnnotations,
  findOverlappingAnnotation,
};

function isAnnotationTextOverlappedWithAnyAnnotations(
  annotations: annotationType[],
  annotationStart: number,
  annotationText: string,
) {
  return annotations.some((otherAnnotation) =>
    annotationModule.lib.areOverlapping(
      annotationModule.lib.buildAnnotation({
        category: otherAnnotation.category,
        start: annotationStart,
        text: annotationText,
      }),
      otherAnnotation,
    ),
  );
}

function findOverlappingAnnotation(annotations: annotationType[], annotationStart: number, annotationText: string) {
  return annotations.find((otherAnnotation) =>
    annotationModule.lib.areOverlapping(
      annotationModule.lib.buildAnnotation({
        category: otherAnnotation.category,
        start: annotationStart,
        text: annotationText,
      }),
      otherAnnotation,
    ),
  );
}
