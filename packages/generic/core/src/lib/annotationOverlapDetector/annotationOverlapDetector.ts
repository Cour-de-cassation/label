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
        entityId: otherAnnotation.entityId,
        start: annotationStart,
        text: annotationText,
        certaintyScore: 1,
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
        entityId: otherAnnotation.entityId,
        start: annotationStart,
        text: annotationText,
        certaintyScore: 1,
      }),
      otherAnnotation,
    ),
  );
}
