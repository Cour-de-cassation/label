import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { ressourceFilterType } from '../ressourceFilterType';

export { ressourceFilterGenerator };

const ressourceFilterGenerator: generatorType<ressourceFilterType> = {
  generate: ({
    endDate,
    mustHaveAddedAnnotations,
    mustHaveDeletedAnnotations,
    mustHaveModifiedAnnotations,
    mustHaveNoModifications,
    mustHaveResizedBiggerAnnotations,
    mustHaveResizedSmallerAnnotations,
    publicationCategory,
    startDate,
    source,
    userId,
  } = {}) => ({
    endDate: endDate ? endDate : undefined,
    mustHaveAddedAnnotations: mustHaveAddedAnnotations ? mustHaveAddedAnnotations : false,
    mustHaveDeletedAnnotations: mustHaveDeletedAnnotations ? mustHaveDeletedAnnotations : false,
    mustHaveModifiedAnnotations: mustHaveModifiedAnnotations ? mustHaveModifiedAnnotations : false,
    mustHaveNoModifications: mustHaveNoModifications ? mustHaveNoModifications : false,
    mustHaveResizedBiggerAnnotations: mustHaveResizedBiggerAnnotations ? mustHaveResizedBiggerAnnotations : false,
    mustHaveResizedSmallerAnnotations: mustHaveResizedSmallerAnnotations ? mustHaveResizedSmallerAnnotations : false,
    publicationCategory: publicationCategory ? publicationCategory : undefined,
    startDate: startDate ? startDate : undefined,
    source: source ? source : undefined,
    userId: userId ? idModule.lib.buildId(userId) : undefined,
  }),
};
