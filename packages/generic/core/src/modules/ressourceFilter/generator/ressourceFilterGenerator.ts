import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { ressourceFilterType } from '../ressourceFilterType';

export { ressourceFilterGenerator };

const ressourceFilterGenerator: generatorType<ressourceFilterType> = {
  generate: ({
    endDate,
    mustHaveSubAnnotations,
    mustHaveSurAnnotations,
    publicationCategory,
    startDate,
    source,
    userId,
  } = {}) => ({
    endDate: endDate ? endDate : undefined,
    mustHaveSubAnnotations: mustHaveSubAnnotations ? mustHaveSubAnnotations : false,
    mustHaveSurAnnotations: mustHaveSurAnnotations ? mustHaveSurAnnotations : false,
    publicationCategory: publicationCategory ? publicationCategory : undefined,
    startDate: startDate ? startDate : undefined,
    source: source ? source : undefined,
    userId: userId ? idModule.lib.buildId(userId) : undefined,
  }),
};
