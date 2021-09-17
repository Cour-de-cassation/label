import { annotationModule } from '../../annotation';
import { annotationsDiffType } from '../annotationsDiffType';

export { assertAnnotationsDiffAutoConsistent };

function assertAnnotationsDiffAutoConsistent(annotationsDiff: annotationsDiffType, actionToPerform?: string) {
  const afterAnnotations = [...annotationsDiff.after].sort(
    (annotationA, annotationB) => annotationA.start - annotationB.start,
  );
  for (let i = 1, l = afterAnnotations.length; i < l; i++) {
    const annotationA = afterAnnotations[i - 1];
    const annotationB = afterAnnotations[i];
    if (annotationModule.lib.areOverlapping(annotationA, annotationB)) {
      const errorMessage = `${
        actionToPerform ? `Could not ${actionToPerform}: ` : ''
      }annotations ${annotationModule.lib.stringify(annotationA)} and ${annotationModule.lib.stringify(
        annotationB,
      )} overlap.`;
      throw new Error(errorMessage);
    }
  }
  return true;
}
