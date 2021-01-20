import { nlpAnnotationsGenerator } from '../generator';

export { nlpFakeServer };

let nlpAnnotations = nlpAnnotationsGenerator.generate();

const nlpFakeServer = {
  reinitialize: () => {
    nlpAnnotations = nlpAnnotationsGenerator.generate();
  },
  getNlpAnnotations() {
    return nlpAnnotations;
  },
};
