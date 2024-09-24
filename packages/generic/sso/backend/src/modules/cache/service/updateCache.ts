import { cacheType } from '@label/core';
import { buildCacheRepository } from '../repository';

export { updateCacheContent };

async function updateCacheContent(
  key: cacheType['key'],
  content: cacheType['content'],
) {
  const cacheRepository = buildCacheRepository();
  const caches = await cacheRepository.findAllByKey(key);
  caches.forEach((cache: cacheType, index: number) => {
    if (index != 0) {
      cacheRepository.deleteById(cache._id);
    }
  });

  return cacheRepository.updateContentById(caches[0]._id, content);
}
