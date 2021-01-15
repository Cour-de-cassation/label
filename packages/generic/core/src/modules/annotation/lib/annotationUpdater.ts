import { annotationType } from '../annotationType';
import { entityIdHandler } from './entityIdHandler';

export { annotationUpdater };

const annotationUpdater = {
  updateAnnotationCategory,
  updateAnnotationsCategory,
  updateAnnotationText,
};

function updateAnnotationsCategory(
  annotations: annotationType[],
  newCategory: string,
  shouldUpdate: (annotation: annotationType) => boolean,
) {
  const updatedAnnotations: annotationType[] = [];

  return {
    newAnnotations: annotations.map((annotation) => {
      if (shouldUpdate(annotation)) {
        updatedAnnotations.push(annotation);
        return entityIdHandler.syncEntityIdWithCategory({
          ...annotation,
          category: newCategory,
        });
      } else {
        return annotation;
      }
    }),
    updatedAnnotations,
  };
}

function updateAnnotationCategory(annotation: annotationType, newCategory: string): annotationType {
  return entityIdHandler.syncEntityId({
    ...annotation,
    category: newCategory,
  });
}

function updateAnnotationText(annotation: annotationType, newText: string, newStart: number): annotationType {
  return entityIdHandler.syncEntityId({
    ...annotation,
    start: newStart,
    text: newText,
  });
}
