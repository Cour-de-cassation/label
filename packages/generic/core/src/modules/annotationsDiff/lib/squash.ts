import { annotationsDiffType } from '../annotationsDiffType';
import { buildAnnotationsDiff } from './buildAnnotationsDiff';

export { squash };

function squash(annotationsDiffs: annotationsDiffType[]): annotationsDiffType {
  return annotationsDiffs.reduce(squashDiff);
}

function squashDiff(
  previousAnnotationsDiff: annotationsDiffType,
  nextAnnotationsDiff: annotationsDiffType,
): annotationsDiffType {
  const before = [
    ...previousAnnotationsDiff.before,
    ...nextAnnotationsDiff.before.filter((annotation) => !previousAnnotationsDiff.after.includes(annotation)),
  ];
  const after = [
    ...nextAnnotationsDiff.after,
    ...previousAnnotationsDiff.after.filter((annotation) => !nextAnnotationsDiff.before.includes(annotation)),
  ];

  return buildAnnotationsDiff(before, after);
}
