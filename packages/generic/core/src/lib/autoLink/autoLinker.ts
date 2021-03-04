import { annotationType } from '../../modules';
import { annotationLinkHandler } from '../annotationLinkHandler';
import { stringComparator } from '../stringComparator';

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
      (stringComparator.insensitiveEqual(annotation.text, someAnnotation.text) ||
        isSubWord(annotation, someAnnotation) ||
        isSubWord(someAnnotation, annotation) ||
        stringComparator.similar(someAnnotation.text, annotation.text)),
  );
}

function isSubWord(annotation1: annotationType, annotation2: annotationType): boolean {
  return (
    stringComparator
      .normalizeString(annotation2.text)
      .includes(`${stringComparator.normalizeString(annotation1.text)} `) ||
    stringComparator
      .normalizeString(annotation2.text)
      .includes(` ${stringComparator.normalizeString(annotation1.text)}`)
  );
}
