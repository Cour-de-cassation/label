import { annotationModule } from '../../../modules/annotation';
import { annotationsDiffType } from '../annotationsDiffType';

export { areAnnotationsDiffAutoConsistent };

function areAnnotationsDiffAutoConsistent(annotationsDiff: annotationsDiffType) {
  const afterAnnotations = [...annotationsDiff.after].sort(
    (annotationA, annotationB) => annotationA.start - annotationB.start,
  );
  for (let i = 1, l = afterAnnotations.length; i < l; i++) {
    if (annotationModule.lib.areOverlapping(afterAnnotations[i - 1], afterAnnotations[i])) {
      return false;
    }
  }
  return true;
}
