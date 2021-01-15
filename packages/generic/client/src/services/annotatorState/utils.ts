import { annotationType } from '@label/core';

export { sortAnnotations };

function sortAnnotations(annotations: annotationType[]) {
  return annotations.sort(
    (annotation1, annotation2) =>
      annotation1.start - annotation2.start || annotation1.text.localeCompare(annotation2.text),
  );
}
