import { annotationType } from '../../newAnnotationModule';
import { annotationsDiffType } from '../annotationsDiffType';

export { buildAnnotationsDiff };

function buildAnnotationsDiff(before: annotationType[], after: annotationType[]): annotationsDiffType {
  return { before: sortAnnotations(before), after: sortAnnotations(after) };
}

function sortAnnotations(annotations: annotationType[]) {
  return annotations.sort(
    (annotation1, annotation2) =>
      annotation1.start - annotation2.start ||
      annotation1.entityId.localeCompare(annotation2.entityId) ||
      annotation1.text.localeCompare(annotation2.text) ||
      annotation1.category.localeCompare(annotation2.category),
  );
}
