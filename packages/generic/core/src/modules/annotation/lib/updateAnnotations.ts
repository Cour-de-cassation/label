import { fetchedAnnotationType } from "../annotationType";

export { updateAnnotations, updateAnnotation };

const LABEL_ANNOTATION_SOURCE = "label";

function updateAnnotations<annotationT extends fetchedAnnotationType>(
  annotations: annotationT[],
  update: (annotation: annotationT) => annotationT
): annotationT[] {
  return annotations.map((annotation) => updateAnnotation(annotation, update));
}

function updateAnnotation<annotationT extends fetchedAnnotationType>(
  annotation: annotationT,
  update: (annotation: annotationT) => annotationT
): annotationT {
  return {
    ...update(annotation),
    source: LABEL_ANNOTATION_SOURCE,
  };
}
