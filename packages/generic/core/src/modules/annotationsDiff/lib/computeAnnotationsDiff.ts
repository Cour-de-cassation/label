import { annotationModule, annotationType } from '../../annotation';

export { computeAnnotationsDiff };

function computeAnnotationsDiff(previousAnnotations: annotationType[], nextAnnotations: annotationType[]) {
  return {
    before: annotationModule.lib.sortAnnotations(
      previousAnnotations.filter(
        (previousAnnotation) =>
          !nextAnnotations.some((annotation) => annotationModule.lib.comparator.equal(annotation, previousAnnotation)),
      ),
    ),
    after: annotationModule.lib.sortAnnotations(
      nextAnnotations.filter(
        (nextAnnotation) =>
          !previousAnnotations.some((annotation) => annotationModule.lib.comparator.equal(annotation, nextAnnotation)),
      ),
    ),
  };
}
