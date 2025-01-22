import { annotationType } from '../annotationType';
import { normalizeString } from '../../../lib/stringComparator/normalizeString';
import { motivationCategoryHandler } from '../../../modules/settings/lib';

export { entityIdHandler };

const entityIdHandler = {
  compute,
  syncEntityId,
  syncEntityIdWithCategory,
};

function compute(category: string, text: string) {
  if (category === motivationCategoryHandler.getCategoryName()) {
    return `${category}_${text.length}`;
  }
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
