import { generatorType } from '../../../types';
import { entityIdHandler } from '../lib';
import { idModule } from '../../id';
import { annotationType } from '../annotationType';

export { annotationGenerator };

const annotationGenerator: generatorType<annotationType> = {
  generate: ({ category, documentId, _id, source, start, text } = {}) => {
    const annotationFields = {
      category: category ? category : `CATEGORY_${Math.random()}`,
      documentId: documentId ? idModule.lib.buildId(documentId) : idModule.lib.buildId(),
      _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
      source: source ? source : `SOURCE_${Math.random()}`,
      start: start ? start : 0,
      text: text ? text : `TEXT_${Math.random()}`,
    };

    return {
      ...annotationFields,
      entityId: entityIdHandler.compute(annotationFields.category, annotationFields.text),
    };
  },
};
