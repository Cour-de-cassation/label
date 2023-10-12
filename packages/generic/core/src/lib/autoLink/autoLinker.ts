import { settingsType } from '../../modules/settings';
import { annotationType } from '../../modules/annotation';
import { annotationLinkHandler } from '../annotationLinkHandler';
import { stringComparator } from '../stringComparator';

export { autoLinker };

const autoLinker = {
  autoLink,
  autoLinkAll,
};

function autoLinkAll(annotations: annotationType[], settings: settingsType): annotationType[] {
  return autoLink(annotations, annotations, settings);
}

function autoLink(
  annotationsToLink: annotationType[],
  annotations: annotationType[],
  settings: settingsType,
): annotationType[] {
  return annotationsToLink.reduce((linkedAnnotations, annotation) => {
    const annotationsToLinkTo = computeAnnotationsToLinkTo(annotation, linkedAnnotations, settings);
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

function computeAnnotationsToLinkTo(annotation: annotationType, annotations: annotationType[], settings: settingsType) {
  return annotations.filter((someAnnotation) => {
    const { autoLinkSensitivity } = settings[annotation.category];
    return (
      annotation.category === someAnnotation.category &&
      !annotationLinkHandler.isLinkedTo(annotation, someAnnotation) &&
      autoLinkSensitivity?.reduce((accumulator, stringComparisonSensitivity) => {
        switch (stringComparisonSensitivity.kind) {
          case 'caseInsensitive':
            return accumulator || stringComparator.insensitiveEqual(annotation.text, someAnnotation.text);
          case 'levenshteinDistance':
            return (
              accumulator ||
              stringComparator.similar(someAnnotation.text, annotation.text, stringComparisonSensitivity.threshold)
            );
          case 'inclusion':
            return accumulator || isSubWord(annotation, someAnnotation) || isSubWord(someAnnotation, annotation);
        }
      }, false as boolean)
    );
  });
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
