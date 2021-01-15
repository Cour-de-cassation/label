import { annotationType } from '../../modules';
import { annotationLinkHandler } from '../annotationLinkHandler';
import { computeLevenshteinDistance } from './computeLevenshteinDistance';

export { autoLinker };

const autoLinker = {
  autoLink,
  autoLinkAll,
};

function autoLinkAll(annotations: annotationType[]): annotationType[] {
  return autoLink(annotations, annotations);
}

function autoLink(annotationsToLink: annotationType[], annotations: annotationType[]): annotationType[] {
  return annotationsToLink.reduce((linkedAnnotations, annotation) => {
    const annotationsToLinkTo = computeAnnotationsToLinkTo(annotation, linkedAnnotations);
    return linkToAnnotations(annotation, annotationsToLinkTo, linkedAnnotations);
  }, annotations);
}

function linkToAnnotations(
  annotation: annotationType,
  annotationsToLinkTo: annotationType[],
  annotations: annotationType[],
) {
  return annotationsToLinkTo.reduce((linkedAnnotations, annotationToLinkTo) => {
    return annotationLinkHandler.link(annotation, annotationToLinkTo, linkedAnnotations);
  }, annotations);
}

function computeAnnotationsToLinkTo(annotation: annotationType, annotations: annotationType[]) {
  return annotations.filter(
    (someAnnotation) =>
      annotation.category === someAnnotation.category &&
      !annotationLinkHandler.isLinkedTo(annotation, someAnnotation) &&
      (equalCaseInsensitive(annotation, someAnnotation) ||
        isSubWord(annotation, someAnnotation) ||
        isSubWord(someAnnotation, annotation) ||
        areSimilarWords(someAnnotation, annotation)),
  );
}

function equalCaseInsensitive(annotation1: annotationType, annotation2: annotationType): boolean {
  return annotation1.text.toUpperCase() === annotation2.text.toUpperCase();
}

function isSubWord(annotation1: annotationType, annotation2: annotationType): boolean {
  return (
    normalizeString(annotation2.text).includes(`${normalizeString(annotation1.text)} `) ||
    normalizeString(annotation2.text).includes(` ${normalizeString(annotation1.text)}`)
  );
}

function areSimilarWords(annotation1: annotationType, annotation2: annotationType): boolean {
  return computeLevenshteinDistance(normalizeString(annotation1.text), normalizeString(annotation2.text)) <= 2;
}

function normalizeString(str: string): string {
  return str.toUpperCase();
}
