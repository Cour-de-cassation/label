import { annotationType } from '../annotationType';

export { entityIdHandler };

const entityIdHandler = {
  compute,
  syncEntityId,
  syncEntityIdWithCategory,
};

function compute(category: string, text: string) {
  return `${category}_${text.toLocaleLowerCase()}`;
}

function syncEntityId(annotation: annotationType): annotationType {
  return {
    ...annotation,
    entityId: compute(annotation.category, annotation.text),
  };
}

function syncEntityIdWithCategory(annotation: annotationType): annotationType {
  return {
    ...annotation,
    entityId: compute(annotation.category, annotation.text),
  };
}
