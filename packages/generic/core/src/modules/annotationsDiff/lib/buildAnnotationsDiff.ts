import { annotationModule, annotationType } from '../../annotation';
import { annotationsDiffType } from '../annotationsDiffType';

export { buildAnnotationsDiff };

function buildAnnotationsDiff(before: annotationType[], after: annotationType[]): annotationsDiffType {
  return { before: annotationModule.lib.sortAnnotations(before), after: annotationModule.lib.sortAnnotations(after) };
}
