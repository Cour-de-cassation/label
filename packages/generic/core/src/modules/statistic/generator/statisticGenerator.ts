import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { statisticType } from '../statisticType';

export { statisticGenerator };

const statisticGenerator: generatorType<statisticType> = {
  generate: ({
    _id,
    countAddedAnnotations,
    countDeletedAnnotations,
    countModifiedAnnotations,
    countResizedBiggerAnnotations,
    countResizedSmallerAnnotations,
    documentNumber,
    publicationCategory,
    treatmentDuration,
    userId,
  } = {}) => ({
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    countAddedAnnotations: countAddedAnnotations ? countAddedAnnotations : 0,
    countDeletedAnnotations: countDeletedAnnotations ? countDeletedAnnotations : 0,
    countModifiedAnnotations: countModifiedAnnotations ? countModifiedAnnotations : 0,
    countResizedBiggerAnnotations: countResizedBiggerAnnotations ? countResizedBiggerAnnotations : 0,
    countResizedSmallerAnnotations: countResizedSmallerAnnotations ? countResizedSmallerAnnotations : 0,
    documentNumber: documentNumber ? documentNumber : 0,
    publicationCategory: publicationCategory ? publicationCategory : [],
    treatmentDuration: treatmentDuration ? treatmentDuration : 0,
    userId: userId ? idModule.lib.buildId(userId) : idModule.lib.buildId(),
  }),
};
