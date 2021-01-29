import { annotationModule, annotationType } from '../../annotation';
import { annotationsDiffType } from '../annotationsDiffType';

export { applyToAnnotations };

function applyToAnnotations(annotations: annotationType[], annotationsDiff: annotationsDiffType): annotationType[] {
  const newAnnotations = annotations.filter((annotation) => !annotationsDiff.before.includes(annotation));
  newAnnotations.push(...annotationsDiff.after);

  return annotationModule.lib.sortAnnotations(newAnnotations);
}
