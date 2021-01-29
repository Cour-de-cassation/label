import { annotationType } from '../../annotation';
import { annotationsDiffType } from '../annotationsDiffType';
import { applyToAnnotations } from './applyToAnnotations';

export { squash };

function squash(annotationsDiffs: annotationsDiffType[]): annotationsDiffType {
  return annotationsDiffs.length === 0
    ? { before: [], after: [] }
    : {
        before: annotationsDiffs[0].before,
        after: annotationsDiffs.reduce(applyToAnnotations, [] as annotationType[]),
      };
}
