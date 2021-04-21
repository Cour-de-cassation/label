import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { ressourceFilterType } from '../ressourceFilterType';

export { ressourceFilterGenerator };

const ressourceFilterGenerator: generatorType<ressourceFilterType> = {
  generate: ({ source, userId } = {}) => ({
    source: source ? source : undefined,
    userId: userId ? idModule.lib.buildId(userId) : undefined,
  }),
};
