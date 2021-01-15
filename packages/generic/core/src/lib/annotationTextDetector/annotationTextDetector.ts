import { annotationType } from '../../modules';

export { annotationTextDetector };

const annotationTextDetector = {
  detectAnnotationTextsAndIndices,
};

function detectAnnotationTextsAndIndices(documentText: string, annotationText: string, annotations: annotationType[]) {
  let currentIndex = -1;
  const textsAndIndices: { text: string; index: number }[] = [];
  do {
    currentIndex = documentText.indexOf(annotationText, currentIndex + 1);
    if (
      currentIndex !== -1 &&
      !isAnnotationTextInsideLargerWord(currentIndex) &&
      !isAnnotationTextOverlappedWithAnyAnnotations(currentIndex)
    ) {
      textsAndIndices.push({ index: currentIndex, text: annotationText });
    }
  } while (currentIndex !== -1);
  return textsAndIndices;

  function isAnnotationTextInsideLargerWord(index: number) {
    const nonBoundaryCharacterRegex = /^[a-zA-Z0-9-_ÈÉÊÎÏÔÖÙÚÛÜèéêîïôöùû]/;
    const isWordBeginningOnBoundary = index === 0 || !documentText[index - 1].match(nonBoundaryCharacterRegex);
    const isWordEndingOnBoundary =
      index + annotationText.length === documentText.length ||
      !documentText[index + annotationText.length].match(nonBoundaryCharacterRegex);
    return !isWordBeginningOnBoundary || !isWordEndingOnBoundary;
  }

  function isAnnotationTextOverlappedWithAnyAnnotations(index: number) {
    return annotations.some((annotation) =>
      areOverlapping(annotation.start, annotation.start + annotation.text.length, index, index + annotationText.length),
    );
  }

  function areOverlapping(startA: number, endA: number, startB: number, endB: number) {
    return (
      (startA < startB && endA > startB) ||
      (startA <= startB && endA >= endB) ||
      (startB < startA && endB > startA) ||
      (startB <= startA && endB >= endA)
    );
  }
}
