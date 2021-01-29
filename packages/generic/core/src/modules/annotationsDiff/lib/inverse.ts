import { annotationsDiffType } from '../annotationsDiffType';

export { inverse };

function inverse(annotationsDiff: annotationsDiffType): annotationsDiffType {
  return {
    before: annotationsDiff.after,
    after: annotationsDiff.before,
  };
}
