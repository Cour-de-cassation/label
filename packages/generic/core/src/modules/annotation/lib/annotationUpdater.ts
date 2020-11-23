import { LABEL_ANNOTATION_SOURCE, fetchedAnnotationType } from '../annotationType';
import { entityIdHandler } from './entityIdHandler';

export { annotationUpdater, LABEL_ANNOTATION_SOURCE };

const annotationUpdater = {
  updateAnnotationCategory,
  updateAnnotationsCategory,
  updateAnnotationText,
};

function updateAnnotationsCategory<annotationT extends fetchedAnnotationType>(
  annotations: annotationT[],
  newCategory: string,
  shouldUpdate: (annotation: annotationT) => boolean,
) {
  const updatedAnnotations: annotationT[] = [];

  return {
    newAnnotations: annotations.map((annotation) => {
      if (shouldUpdate(annotation)) {
        updatedAnnotations.push(annotation);
        return entityIdHandler.syncEntityIdWithCategory(
          updateAnnotationSource({
            ...annotation,
            category: newCategory,
          }),
        );
      } else {
        return annotation;
      }
    }),
    updatedAnnotations,
  };
}

function updateAnnotationCategory<annotationT extends fetchedAnnotationType>(
  annotation: annotationT,
  newCategory: string,
) {
  return entityIdHandler.syncEntityId(
    updateAnnotationSource({
      ...annotation,
      category: newCategory,
    }),
  );
}

function updateAnnotationText<annotationT extends fetchedAnnotationType>(
  annotation: annotationT,
  newText: string,
  newStart: number,
): annotationT {
  return entityIdHandler.syncEntityId(
    updateAnnotationSource({
      ...annotation,
      start: newStart,
      text: newText,
    }),
  );
}

function updateAnnotationSource<annotationT extends fetchedAnnotationType>(annotation: annotationT): annotationT {
  return {
    ...annotation,
    source: LABEL_ANNOTATION_SOURCE,
  };
}
