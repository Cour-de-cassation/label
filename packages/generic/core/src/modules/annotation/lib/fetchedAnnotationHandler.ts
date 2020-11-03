import { idModule } from '../../id';
import { fetchedAnnotationType } from '../annotationType';
import { entityIdHandler } from './entityIdHandler';

export { fetchedAnnotationHandler, LABEL_ANNOTATION_SOURCE };

const fetchedAnnotationHandler = {
  create,
  createAll,
  update,
  updateMany,
  getAnnotationIndex,
};

const LABEL_ANNOTATION_SOURCE = 'label';

function create(category: string, index: number, text: string): fetchedAnnotationType {
  return idModule.lib.buildObjectWithId({
    category,
    start: index,
    entityId: entityIdHandler.compute(category, text),
    source: LABEL_ANNOTATION_SOURCE,
    text,
  });
}

function createAll(
  category: string,
  documentText: string,
  annotationText: string,
  annotations: fetchedAnnotationType[],
) {
  const indicesOfAnnotationText = findAllNewAnnotationIndices();

  return indicesOfAnnotationText.map((annotationTextIndex) => create(category, annotationTextIndex, annotationText));

  function findAllNewAnnotationIndices() {
    let currentIndex = -1;
    const indices: number[] = [];

    do {
      currentIndex = documentText.indexOf(annotationText, currentIndex + 1);
      if (
        currentIndex !== -1 &&
        !isAnnotationTextInsideLargerWord(currentIndex) &&
        !isAnnotationTextOverlappedWithAnyAnnotations(currentIndex)
      ) {
        indices.push(currentIndex);
      }
    } while (currentIndex !== -1);

    return indices;

    function isAnnotationTextInsideLargerWord(index: number) {
      const nonBoundaryCharacterRegex = /^[a-zA-Z0-9-_ÈÉÊÎÏÔÖÙÚÛÜèéêîïôöùû]/;
      const isWordBeginningOnBoundary = index === 0 || !documentText[index - 1].match(nonBoundaryCharacterRegex);
      const isWordEndingOnBoundary =
        index + annotationText.length === documentText.length ||
        !documentText[index + annotationText.length].match(nonBoundaryCharacterRegex);
      return !isWordBeginningOnBoundary || !isWordEndingOnBoundary;
    }

    function isAnnotationTextOverlappedWithAnyAnnotations(index: number) {
      return annotations.some(isAnnotationTextOverlappedWithOtherAnnotation);

      function isAnnotationTextOverlappedWithOtherAnnotation(annotation: fetchedAnnotationType) {
        return annotation.start + annotation.text.length > index || annotation.start < index + annotationText.length;
      }
    }
  }
}

function updateMany(
  annotations: fetchedAnnotationType[],
  updateAnnotation: (annotation: fetchedAnnotationType) => fetchedAnnotationType,
): fetchedAnnotationType[] {
  return annotations.map((annotation) => update(annotation, updateAnnotation));
}

function update(
  annotation: fetchedAnnotationType,
  updateAnnotation: (annotation: fetchedAnnotationType) => fetchedAnnotationType,
): fetchedAnnotationType {
  return {
    ...updateAnnotation(annotation),
    source: LABEL_ANNOTATION_SOURCE,
  };
}

function getAnnotationIndex(annotation: fetchedAnnotationType, annotations: fetchedAnnotationType[]) {
  const sameEntityAnnotations = annotations.filter(
    (anotherAnnotation) => anotherAnnotation.entityId === annotation.entityId,
  );
  const sortedSameEntityAnnotations = sameEntityAnnotations.sort(
    (sameEntityAnnotation1, sameEntityAnnotation2) => sameEntityAnnotation1.start - sameEntityAnnotation2.start,
  );
  const annotationIndex = sortedSameEntityAnnotations.findIndex(
    (sameEntityAnnotation) => sameEntityAnnotation.start === annotation.start,
  );

  return { index: annotationIndex + 1, total: sameEntityAnnotations.length };
}
