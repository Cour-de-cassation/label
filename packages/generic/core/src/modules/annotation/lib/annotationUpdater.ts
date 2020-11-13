import { fetchedAnnotationType } from '../annotationType';
import { entityIdHandler } from './entityIdHandler';

export { annotationUpdater };

const annotationUpdater = {
  updateCategory,
  updateText,
};

function updateCategory<annotationT extends fetchedAnnotationType>(annotation: annotationT, newCategory: string) {
  return {
    ...annotation,
    category: newCategory,
    entityId: entityIdHandler.compute(newCategory, entityIdHandler.getText(annotation.entityId)),
  };
}

function updateText<annotationT extends fetchedAnnotationType>(
  annotation: annotationT,
  newText: string,
  newStart: number,
): annotationT {
  return {
    ...annotation,
    start: newStart,
    text: newText,
  };
}
