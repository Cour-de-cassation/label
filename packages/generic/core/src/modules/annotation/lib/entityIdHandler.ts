import { annotationType } from '../annotationType';
import { normalizeString } from '../../../lib/stringComparator/normalizeString';

export { entityIdHandler };

const entityIdHandler = {
  compute,
  syncEntityId,
  syncEntityIdWithCategory,
};

function compute(category: string, text: string) {
  return `${category}_${normalizeString(text.toLocaleLowerCase())}`;
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
