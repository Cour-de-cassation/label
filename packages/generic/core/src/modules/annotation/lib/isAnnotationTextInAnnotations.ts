import { annotationType } from '../annotationType';
import { splitTextIntoWords } from './splitTextIntoWords';

export { isAnnotationTextInAnnotations };

function isAnnotationTextInAnnotations(annotation: annotationType, annotationsToSearchIn: annotationType[]) {
  const annotationWords = splitTextIntoWords(annotation.text, annotation.start);

  return annotationWords.every((word) =>
    annotationsToSearchIn.some(
      (annotationToSearchIn) =>
        annotationToSearchIn.text.includes(word.text) &&
        annotationToSearchIn.start <= word.start &&
        annotationToSearchIn.start + annotationToSearchIn.text.length >= word.start + word.text.length,
    ),
  );
}
