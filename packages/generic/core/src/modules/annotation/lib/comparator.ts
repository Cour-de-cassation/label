import { annotationType } from '../annotationType';

export { comparator };

const comparator = {
  equal(annotation1: annotationType, annotation2: annotationType) {
    return (
      annotation1.text === annotation2.text &&
      annotation1.start === annotation2.start &&
      annotation1.category === annotation2.category
    );
  },

  equalDeep(annotation1: annotationType, annotation2: annotationType) {
    return (
      annotation1.text === annotation2.text &&
      annotation1.start === annotation2.start &&
      annotation1.category === annotation2.category &&
      annotation1.entityId === annotation2.entityId
    );
  },
};
