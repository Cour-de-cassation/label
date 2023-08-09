import { generatorType } from '../../../types';
import { replacementTermType } from '../replacementTermType';

export { replacementTermGenerator };

const replacementTermGenerator: generatorType<replacementTermType> = {
  generate: ({ annotationId, replacementText } = {}) => {
    const replacementTermFields = {
      annotationId: annotationId ? annotationId : `ANNOTATION_${Math.random()}`,
      replacementText: replacementText ? replacementText : `TEXT_${Math.random()}`,
    };

    return replacementTermFields;
  },
};
