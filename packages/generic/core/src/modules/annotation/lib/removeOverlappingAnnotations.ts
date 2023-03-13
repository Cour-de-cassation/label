import { annotationType } from '../annotationType';
import { areOverlapping } from './areOverlapping';

export { removeOverlappingAnnotations };

function removeOverlappingAnnotations(annotations: annotationType[]): annotationType[] {
  const sortedAnnotations = annotations.sort((annotationA, annotationB) => annotationA.start - annotationB.start);
  const cleanedAnnotations = [];
  cleanedAnnotations.push(sortedAnnotations[0]);
  for (let i = 1, l = sortedAnnotations.length; i < l; i++) {
    const annotationA = sortedAnnotations[i - 1];
    const annotationB = sortedAnnotations[i];
    if (!areOverlapping(annotationA, annotationB)) {
      cleanedAnnotations.push(annotationB);
    }
  }
  return cleanedAnnotations;
}
