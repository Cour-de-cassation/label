import { annotationType } from '../annotationType';

export { comparator };

const comparator = {
  equal(annotation1: annotationType, annotation2: annotationType) {
    return (
      annotation1.text === annotation2.text &&
      annotation1.start === annotation2.start &&
      annotation1.category === annotation2.category &&
      annotation1.entityId === annotation2.entityId
    );
  },

  equalModuloCategory(annotation1: annotationType, annotation2: annotationType) {
    return annotation1.text === annotation2.text && annotation1.start === annotation2.start;
  },

  compareByText(annotation1: annotationType, annotation2: annotationType) {
    if (annotation2.text.toLowerCase() > annotation1.text.toLowerCase()) {
      return -1;
    }
    if (annotation2.text.toLowerCase() < annotation1.text.toLowerCase()) {
      return 1;
    }
    if (annotation2.text > annotation1.text) {
      return -1;
    }
    if (annotation2.text < annotation1.text) {
      return 1;
    }
    return annotation1.start - annotation2.start;
  },
};
