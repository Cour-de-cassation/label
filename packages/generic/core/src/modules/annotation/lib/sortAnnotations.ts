import { annotationType } from '../annotationType';

export { sortAnnotations };

function sortAnnotations(annotations: annotationType[]) {
  return [...annotations].sort(
    (annotation1, annotation2) =>
      annotation1.start - annotation2.start ||
      annotation1.entityId.localeCompare(annotation2.entityId) ||
      annotation1.text.localeCompare(annotation2.text) ||
      annotation1.category.localeCompare(annotation2.category),
  );
}
