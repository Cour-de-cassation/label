import { annotationType } from '../../modules';

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
    areOverlapping(
      otherAnnotation.start,
      otherAnnotation.start + otherAnnotation.text.length,
      annotationStart,
      annotationStart + annotationText.length,
    ),
  );
}

function findOverlappingAnnotation(annotations: annotationType[], annotationStart: number, annotationText: string) {
  return annotations.find((otherAnnotation) =>
    areOverlapping(
      otherAnnotation.start,
      otherAnnotation.start + otherAnnotation.text.length,
      annotationStart,
      annotationStart + annotationText.length,
    ),
  );
}

function areOverlapping(startA: number, endA: number, startB: number, endB: number) {
  return (
    (startA < startB && endA > startB) ||
    (startA <= startB && endA >= endB) ||
    (startB < startA && endB > startA) ||
    (startB <= startA && endB >= endA)
  );
}
