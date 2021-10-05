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
    decisionDate,
    documentExternalId,
    documentNumber,
    jurisdiction,
    linkedEntitiesCount,
    modifiedAnnotationsCount,
    publicationCategory,
    resizedBiggerAnnotationsCount,
    resizedSmallerAnnotationsCount,
    source,
    treatmentDate,
    treatmentsSummary,
    wordsCount,
  } = {}) => ({
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    addedAnnotationsCount: addedAnnotationsCount ? addedAnnotationsCount : { sensitive: 0, other: 0 },
    annotationsCount: annotationsCount ? annotationsCount : 0,
    decisionDate: decisionDate,
    deletedAnnotationsCount: deletedAnnotationsCount ? deletedAnnotationsCount : { anonymised: 0, other: 0 },
    documentExternalId: documentExternalId ? documentExternalId : idModule.lib.convertToString(idModule.lib.buildId()),
    documentNumber: documentNumber !== undefined ? documentNumber : Math.floor(Math.random() * 1000000),
    jurisdiction,
    linkedEntitiesCount: linkedEntitiesCount ? linkedEntitiesCount : 0,
    modifiedAnnotationsCount: modifiedAnnotationsCount
      ? modifiedAnnotationsCount
      : { nonAnonymisedToSensitive: 0, other: 0, anonymisedToNonAnonymised: 0 },
    publicationCategory: publicationCategory ? publicationCategory : [],
    resizedBiggerAnnotationsCount: resizedBiggerAnnotationsCount
      ? resizedBiggerAnnotationsCount
      : { sensitive: 0, other: 0 },
    resizedSmallerAnnotationsCount: resizedSmallerAnnotationsCount
      ? resizedSmallerAnnotationsCount
      : { anonymised: 0, other: 0 },
    source: source ? source : `SOURCE_${Math.random()}`,
    treatmentDate: treatmentDate ? treatmentDate : new Date().getTime(),
    treatmentsSummary: treatmentsSummary ? treatmentsSummary : [],
    wordsCount: wordsCount ? wordsCount : 0,
  }),
};
