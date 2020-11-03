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
    let currentIndex = -1;
    const indices: number[] = [];

    do {
      currentIndex = text.indexOf(searchString, currentIndex + 1);
      if (
        currentIndex !== -1 &&
        !isSearchStringInsideLargerWord(currentIndex)
      ) {
        indices.push(currentIndex);
      }
    } while (currentIndex !== -1);

    return indices;

    function isSearchStringInsideLargerWord(index: number) {
      const nonBoundaryCharacterRegex = /^[a-zA-Z0-9-_ÈÉÊÎÏÔÖÙÚÛÜèéêîïôöùû]/;
      const isWordBeginningOnBoundary =
        index === 0 || !text[index - 1].match(nonBoundaryCharacterRegex);
      const isWordEndingOnBoundary =
        index + searchString.length === text.length - 1 ||
        !text[index + searchString.length].match(nonBoundaryCharacterRegex);
      return !isWordBeginningOnBoundary || !isWordEndingOnBoundary;
    }
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
