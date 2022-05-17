import { cacheModule, cacheType } from '@label/core';
import { buildCacheRepository } from '../repository';

export { createCache };

async function createCache(
  key: cacheType['key'],
  content: cacheType['content'],
) {
  const cacheRepository = buildCacheRepository();

  const cache = cacheModule.generator.generate({ key, content });

  await cacheRepository.insert(cache);

  return cache;
}
