import { fetchedAnnotationType } from '../annotationType';

export { entityIdHandler };

const entityIdHandler = {
  compute,
  getCategory,
  getText,
  syncEntityId,
  syncEntityIdWithCategory,
};

function compute(category: string, text: string) {
  return `${category}_${text}`;
}

function syncEntityId<annotationT extends fetchedAnnotationType>(annotation: annotationT): annotationT {
  return {
    ...annotation,
    entityId: compute(annotation.category, annotation.text),
  };
}

function syncEntityIdWithCategory<annotationT extends fetchedAnnotationType>(annotation: annotationT): annotationT {
  return {
    ...annotation,
    entityId: compute(annotation.category, getText(annotation.entityId)),
  };
}

function getCategory(entityId: string): string {
  const { category } = parseEntityId(entityId);

  return category;
}

function getText(entityId: string): string {
  const { text } = parseEntityId(entityId);

  return text;
}

function parseEntityId(entityId: string) {
  const parsedEntityId = entityId.split('_');

  return { category: parsedEntityId[0], text: parsedEntityId[1] };
}
