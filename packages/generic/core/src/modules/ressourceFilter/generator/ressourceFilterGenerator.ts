import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { ressourceFilterType } from '../ressourceFilterType';

export { ressourceFilterGenerator };

const ressourceFilterGenerator: generatorType<ressourceFilterType> = {
  generate: ({ mustHaveAddedAnnotations, publicationCategory, source, userId } = {}) => ({
    mustHaveAddedAnnotations: mustHaveAddedAnnotations ? mustHaveAddedAnnotations : false,
    publicationCategory: publicationCategory ? publicationCategory : undefined,
    source: source ? source : undefined,
    userId: userId ? idModule.lib.buildId(userId) : undefined,
  }),
};
