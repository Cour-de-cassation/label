import { cacheType, dateBuilder, idModule, indexer } from '@label/core';
import { buildCacheRepository } from '../repository';

export { fetchCache, fetchAllById, fetchAllByKey, fetchAllOlderThan };

async function fetchCache(cacheId: cacheType['_id']): Promise<cacheType> {
  const cacheRepository = buildCacheRepository();

  return cacheRepository.findById(cacheId);
}

async function fetchAllById(cacheIds?: cacheType['_id'][]) {
  const cacheRepository = buildCacheRepository();

  const cachesById = await cacheRepository.findAllByIds(cacheIds);

  if (cacheIds) {
    indexer.assertEveryIdIsDefined(
      cacheIds.map((cacheId) => idModule.lib.convertToString(cacheId)),
      cachesById,
      (_id: string) => `The cache id ${_id} has no matching cache`,
    );
  }

  return cachesById;
}

async function fetchAllByKey(cacheKey: cacheType['key']): Promise<cacheType[]> {
  const cacheRepository = buildCacheRepository();

  return cacheRepository.findAllByKey(cacheKey);
}

async function fetchAllOlderThan(minutes: number): Promise<cacheType[]> {
  const minutesAgo = dateBuilder.minutesAgo(minutes);
  const cacheRepository = buildCacheRepository();

  const caches = await cacheRepository.findAll();

  return caches.filter((cache: cacheType) => cache.updateDate < minutesAgo);
}
