import { fetchedAnnotationType } from '../annotationType';
import { entityIdHandler } from './entityIdHandler';

export { annotationUpdater };

const annotationUpdater = {
  updateAnnotationCategory,
  updateAnnotationsCategory,
  updateAnnotationText,
};

const LABEL_ANNOTATION_SOURCE = 'label';

function updateAnnotationsCategory<annotationT extends fetchedAnnotationType>(
  annotations: annotationT[],
  newCategory: string,
  shouldUpdate: (annotation: annotationT) => boolean,
) {
  return annotations.map((annotation) =>
    shouldUpdate(annotation)
      ? entityIdHandler.syncEntityIdWithCategory(
          updateAnnotationSource({
            ...annotation,
            category: newCategory,
          }),
        )
      : annotation,
  );
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
