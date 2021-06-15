import { annotationType } from '../../modules/annotation';
import { annotationOverlapDetector } from '../annotationOverlapDetector';

export { annotationTextDetector };

const annotationTextDetector = {
  detectAnnotationTextsAndIndices,
};

function detectAnnotationTextsAndIndices({
  documentText,
  annotationText,
  annotations,
}: {
  documentText: string;
  annotationText: string;
  annotations: annotationType[];
}) {
  let currentIndex = -1;
  const textsAndIndices: { text: string; index: number }[] = [];
  do {
    const annotationDetection = computeAnnotationDetection(documentText, annotationText, currentIndex);
    currentIndex = annotationDetection.index;
    if (
      currentIndex !== -1 &&
      !annotationOverlapDetector.isAnnotationTextOverlappedWithAnyAnnotations(
        annotations,
        currentIndex,
        annotationDetection.text,
      ) &&
      !isAnnotationTextInsideLargerWord(documentText, annotationText, currentIndex)
    ) {
      textsAndIndices.push({ index: currentIndex, text: annotationDetection.text });
    }
  } while (currentIndex !== -1);
  return textsAndIndices;
}

function isAnnotationTextInsideLargerWord(documentText: string, annotationText: string, index: number) {
  const nonBoundaryCharacterRegex = /^[a-zA-Z0-9ÈÉÊÎÏÔÖÙÚÛÜèéêîïôöùû]/;
  const isWordBeginningOnBoundary = index === 0 || !documentText[index - 1].match(nonBoundaryCharacterRegex);
  const isWordEndingOnBoundary =
    index + annotationText.length === documentText.length ||
    !documentText[index + annotationText.length].match(nonBoundaryCharacterRegex);
  return !isWordBeginningOnBoundary || !isWordEndingOnBoundary;
}

function computeAnnotationDetection(documentText: string, annotationText: string, currentIndex: number) {
  const text = replaceAccents(annotationText);
  const index = replaceAccents(documentText).indexOf(text, currentIndex + 1);
  if (index !== -1) {
    return {
      index,
      text: documentText.substr(index, text.length),
    };
  }
  return {
    text: annotationText,
    index: -1,
  };
}

function replaceAccents(text: string) {
  return text
    .toLowerCase()
    .replace(/[àâ]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[ïî]/g, 'i')
    .replace(/[ô]/g, 'o')
    .replace(/[ûùü]/g, 'u')
    .replace(/[ÿ]/g, 'y');
}
