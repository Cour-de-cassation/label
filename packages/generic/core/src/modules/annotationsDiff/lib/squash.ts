import { annotationModule, annotationType } from '../../annotation';
import { annotationsDiffType } from '../annotationsDiffType';

export { squash };

function squash(annotationsDiffs: annotationsDiffType[]): annotationsDiffType {
  return annotationsDiffs.reduce(
    (accumulator, annotationsDiff) => {
      const updatedBefore = [...accumulator.before, ...annotationsDiff.before];
      const updatedAfter = [...accumulator.after, ...annotationsDiff.after];
      return {
        before: updatedBefore.filter(
          (annotation) =>
            !updatedAfter.some((anotherAnnotation) =>
              annotationModule.lib.comparator.equal(anotherAnnotation, annotation),
            ),
        ),
        after: updatedAfter.filter(
          (annotation) =>
            !updatedBefore.some((anotherAnnotation) =>
              annotationModule.lib.comparator.equal(anotherAnnotation, annotation),
            ),
        ),
      };
    },
    { before: [] as annotationType[], after: [] as annotationType[] },
  );
}
