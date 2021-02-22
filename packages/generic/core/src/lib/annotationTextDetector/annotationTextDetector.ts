import { annotationType } from '../../modules';
import { annotationOverlapDetector } from '../annotationOverlapDetector';

export { annotationTextDetector };

const annotationTextDetector = {
  detectAnnotationTextsAndIndices,
};

function detectAnnotationTextsAndIndices({
  documentText,
  annotationIndex,
  annotationText,
  annotations,
}: {
  documentText: string;
  annotationIndex: number;
  annotationText: string;
  annotations: annotationType[];
}) {
  let currentIndex = -1;
  const textsAndIndices: { text: string; index: number }[] = [];
  do {
    currentIndex = documentText.indexOf(annotationText, currentIndex + 1);
    if (
      currentIndex !== -1 &&
      !annotationOverlapDetector.isAnnotationTextOverlappedWithAnyAnnotations(
        annotations,
        currentIndex,
        annotationText,
      ) &&
      (!isAnnotationTextInsideLargerWord(currentIndex) || currentIndex === annotationIndex)
    ) {
      textsAndIndices.push({ index: currentIndex, text: annotationText });
    }
  } while (currentIndex !== -1);
  return textsAndIndices;

  function isAnnotationTextInsideLargerWord(index: number) {
    const nonBoundaryCharacterRegex = /^[a-zA-Z0-9ÈÉÊÎÏÔÖÙÚÛÜèéêîïôöùû]/;
    const isWordBeginningOnBoundary = index === 0 || !documentText[index - 1].match(nonBoundaryCharacterRegex);
    const isWordEndingOnBoundary =
      index + annotationText.length === documentText.length ||
      !documentText[index + annotationText.length].match(nonBoundaryCharacterRegex);
    return !isWordBeginningOnBoundary || !isWordEndingOnBoundary;
  }
}
