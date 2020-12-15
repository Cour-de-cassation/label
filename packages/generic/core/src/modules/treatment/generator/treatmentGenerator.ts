import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { treatmentType } from '../treatmentType';

export { treatmentGenerator };

const treatmentGenerator: generatorType<treatmentType> = {
  generate: ({ _id, userId, documentId, duration, order, annotationIds } = {}) => ({
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    annotationIds: annotationIds ? annotationIds : [],
    documentId: documentId ? idModule.lib.buildId(documentId) : idModule.lib.buildId(userId),
    duration: duration ? duration : 0,
    order: order ? order : 0,
    userId: userId ? idModule.lib.buildId(userId) : idModule.lib.buildId(),
  }),
};
