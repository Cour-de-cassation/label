import { annotationType } from '../annotationType';

export { areAnnotationsIncluded };

function areAnnotationsIncluded(annotation1: annotationType, annotation2: annotationType) {
  if (annotation1.start === annotation2.start && annotation1.text === annotation2.text) {
    return 0;
  }
  if (
    annotation1.start >= annotation2.start &&
    annotation1.start + annotation1.text.length <= annotation2.start + annotation2.text.length
  ) {
    return -1;
  }
  if (
    annotation1.start <= annotation2.start &&
    annotation1.start + annotation1.text.length >= annotation2.start + annotation2.text.length
  ) {
    return 1;
  }
  return undefined;
}
