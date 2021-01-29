import { annotationModule, annotationType } from '../../annotation';

export { computeAnnotationsDiff };

function computeAnnotationsDiff(previousAnnotations: annotationType[], nextAnnotations: annotationType[]) {
  return {
    before: annotationModule.lib.sortAnnotations(
      previousAnnotations.filter((previousAnnotation) => !nextAnnotations.includes(previousAnnotation)),
    ),
    after: annotationModule.lib.sortAnnotations(
      nextAnnotations.filter((nextAnnotation) => !previousAnnotations.includes(nextAnnotation)),
    ),
  };
}
