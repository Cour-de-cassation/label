import { idModule, idType } from '../../id';
import { fetchedAnnotationType } from '../annotationType';
import { entityIdHandler } from './entityIdHandler';

export { fetchedAnnotationHandler, LABEL_ANNOTATION_SOURCE };

const fetchedAnnotationHandler = {
  create,
  update,
  updateMany,
  createAll,
};

const LABEL_ANNOTATION_SOURCE = 'label';

function create(
  category: string,
  documentId: idType,
  index: number,
  text: string,
): fetchedAnnotationType {
  return idModule.lib.buildObjectWithId({
    category,
    start: index,
    documentId,
    entityId: entityIdHandler.compute(category, text),
    source: LABEL_ANNOTATION_SOURCE,
    text,
  });
}

function createAll(
  category: string,
  documentId: idType,
  documentText: string,
  annotationText: string,
) {
  const indicesOfAnnotationText = findAllIndicesOfSearch(
    documentText,
    annotationText,
  );

  return indicesOfAnnotationText.map((annotationTextIndex) =>
    create(category, documentId, annotationTextIndex, annotationText),
  );

  function findAllIndicesOfSearch(text: string, searchString: string) {
    let currentOccurrence = -1;
    const occurrences: number[] = [];

    do {
      currentOccurrence = text.indexOf(searchString, currentOccurrence + 1);
      if (currentOccurrence !== -1) {
        occurrences.push(currentOccurrence);
      }
    } while (currentOccurrence !== -1);

    return occurrences;
  }
}

function updateMany(
  annotations: fetchedAnnotationType[],
  updateAnnotation: (
    annotation: fetchedAnnotationType,
  ) => fetchedAnnotationType,
): fetchedAnnotationType[] {
  return annotations.map((annotation) => update(annotation, updateAnnotation));
}

function update(
  annotation: fetchedAnnotationType,
  updateAnnotation: (
    annotation: fetchedAnnotationType,
  ) => fetchedAnnotationType,
): fetchedAnnotationType {
  return {
    ...updateAnnotation(annotation),
    source: LABEL_ANNOTATION_SOURCE,
  };
}
