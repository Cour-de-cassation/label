import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { statisticType } from '../statisticType';

export { statisticGenerator };

const statisticGenerator: generatorType<statisticType> = {
  generate: ({
    _id,
    addedAnnotationsCount,
    annotationsCount,
    deletedAnnotationsCount,
    documentNumber,
    linkedEntitiesCount,
    modifiedAnnotationsCount,
    publicationCategory,
    resizedBiggerAnnotationsCount,
    resizedSmallerAnnotationsCount,
    source,
    treatmentDuration,
    userId,
    wordsCount,
  } = {}) => ({
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    addedAnnotationsCount: addedAnnotationsCount ? addedAnnotationsCount : 0,
    annotationsCount: annotationsCount ? annotationsCount : 0,
    deletedAnnotationsCount: deletedAnnotationsCount ? deletedAnnotationsCount : 0,
    documentNumber: documentNumber ? documentNumber : 0,
    linkedEntitiesCount: linkedEntitiesCount ? linkedEntitiesCount : 0,
    modifiedAnnotationsCount: modifiedAnnotationsCount ? modifiedAnnotationsCount : 0,
    publicationCategory: publicationCategory ? publicationCategory : [],
    resizedBiggerAnnotationsCount: resizedBiggerAnnotationsCount ? resizedBiggerAnnotationsCount : 0,
    resizedSmallerAnnotationsCount: resizedSmallerAnnotationsCount ? resizedSmallerAnnotationsCount : 0,
    source: source ? source : `SOURCE_${Math.random()}`,
    treatmentDuration: treatmentDuration ? treatmentDuration : 0,
    userId: userId ? idModule.lib.buildId(userId) : idModule.lib.buildId(),
    wordsCount: wordsCount ? wordsCount : 0,
  }),
};
