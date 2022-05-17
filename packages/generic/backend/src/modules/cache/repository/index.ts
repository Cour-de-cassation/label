import { dependencyManager } from '../../../utils';
import { buildCacheRepository } from './buildCacheRepository';
import { buildFakeCacheRepository } from './buildFakeCacheRepository';

export { buildRepository as buildCacheRepository };

const buildRepository = dependencyManager.inject({
  forLocal: buildCacheRepository,
  forProd: buildCacheRepository,
  forTest: buildFakeCacheRepository,
});
