import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { ressourceFilterType } from '../ressourceFilterType';

export { ressourceFilterGenerator };

const ressourceFilterGenerator: generatorType<ressourceFilterType> = {
  generate: ({
    endDate,
    jurisdiction,
    mustHaveSubAnnotations,
    mustHaveSurAnnotations,
    publicationCategory,
    startDate,
    route,
    importer,
    source,
    userId,
  } = {}) => ({
    endDate: endDate ?? undefined,
    jurisdiction: jurisdiction || jurisdiction,
    mustHaveSubAnnotations: mustHaveSubAnnotations ?? false,
    mustHaveSurAnnotations: mustHaveSurAnnotations ?? false,
    publicationCategory: publicationCategory ?? undefined,
    startDate: startDate ?? undefined,
    route: route ?? undefined,
    importer: importer ?? undefined,
    source: source ?? undefined,
    userId: userId ? idModule.lib.buildId(userId) : undefined,
  }),
};
