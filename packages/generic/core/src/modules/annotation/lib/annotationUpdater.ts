import { fetchedAnnotationType } from '../annotationType';
import { entityIdHandler } from './entityIdHandler';

export { annotationUpdater };

const annotationUpdater = {
  updateCategory,
};

function updateCategory<annotationT extends fetchedAnnotationType>(annotation: annotationT, newCategory: string) {
  return {
    ...annotation,
    category: newCategory,
    entityId: entityIdHandler.compute(newCategory, entityIdHandler.getText(annotation.entityId)),
  };
}
