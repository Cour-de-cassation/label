import { annotationModule, fetchedAnnotationType } from '../../modules';
import { computeLevenshteinDistance } from './computeLevenshteinDistance';

export { autoLinker };

const autoLinker = {
  autoLink,
  autoLinkAll,
};

function autoLinkAll<annotationT extends fetchedAnnotationType>(annotations: annotationT[]): annotationT[] {
  return autoLink(annotations, annotations);
}

function autoLink<annotationT extends fetchedAnnotationType>(
  annotationsToLink: annotationT[],
  annotations: annotationT[],
): annotationT[] {
  return annotationsToLink.reduce((linkedAnnotations, annotation) => {
    const annotationsToLinkTo = computeAnnotationsToLinkTo(annotation, linkedAnnotations);
    return linkToAnnotations(annotation, annotationsToLinkTo, linkedAnnotations);
  }, annotations);
}

function linkToAnnotations<annotationT extends fetchedAnnotationType>(
  annotation: annotationT,
  annotationsToLinkTo: annotationT[],
  annotations: annotationT[],
) {
  return annotationsToLinkTo.reduce((linkedAnnotations, annotationToLinkTo) => {
    return annotationModule.lib.annotationLinker.link(annotation, annotationToLinkTo, linkedAnnotations);
  }, annotations);
}

function computeAnnotationsToLinkTo<annotationT extends fetchedAnnotationType>(
  annotation: annotationT,
  annotations: annotationT[],
) {
  return annotations.filter(
    (someAnnotation) =>
      annotation.category === someAnnotation.category &&
      !annotationModule.lib.annotationLinker.isLinkedTo(annotation, someAnnotation) &&
      (equalCaseInsensitive(annotation, someAnnotation) ||
        isSubWord(annotation, someAnnotation) ||
        isSubWord(someAnnotation, annotation) ||
        areSimilarWords(someAnnotation, annotation)),
  );
}

function equalCaseInsensitive<annotationT extends fetchedAnnotationType>(
  annotation1: annotationT,
  annotation2: annotationT,
): boolean {
  return annotation1.text.toUpperCase() === annotation2.text.toUpperCase();
}

function isSubWord<annotationT extends fetchedAnnotationType>(
  annotation1: annotationT,
  annotation2: annotationT,
): boolean {
  return (
    normalizeString(annotation2.text).includes(`${normalizeString(annotation1.text)} `) ||
    normalizeString(annotation2.text).includes(` ${normalizeString(annotation1.text)}`)
  );
}

function areSimilarWords<annotationT extends fetchedAnnotationType>(
  annotation1: annotationT,
  annotation2: annotationT,
): boolean {
  return computeLevenshteinDistance(normalizeString(annotation1.text), normalizeString(annotation2.text)) <= 2;
}

function normalizeString(str: string): string {
  return str.toUpperCase();
}
