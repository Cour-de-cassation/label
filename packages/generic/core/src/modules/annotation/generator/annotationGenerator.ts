import { generatorType } from '../../../types';
import { entityIdHandler } from '../lib';
import { annotationType } from '../annotationType';

export { annotationGenerator };

const annotationGenerator: generatorType<annotationType> = {
  generate: ({ category, start, text, score, source } = {}) => {
    const annotationFields = {
      category: category ? category : `CATEGORY_${Math.random()}`,
      start: start ? start : 0,
      text: text ? text : `TEXT_${Math.random()}`,
      score: score ?? 1,
      source: source ?? 'agent',
    };

    return {
      ...annotationFields,
      entityId: entityIdHandler.compute(annotationFields.category, annotationFields.text),
    };
  },
};
