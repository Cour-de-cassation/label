import { fetchedAnnotationType } from '@label/core';

export { sortAnnotations };

function sortAnnotations(annotations: fetchedAnnotationType[]) {
  return annotations.sort((annotation1, annotation2) =>
    JSON.stringify(annotation1._id).localeCompare(JSON.stringify(annotation2._id)),
  );
}
