import { cacheModule, dateBuilder } from '@label/core';
import { buildCacheRepository } from '../repository';
import { fetchAllOlderThan } from './fetch';

describe('fetch', () => {
  describe('fetchAllCachesOlderThan', () => {
    const cacheRepository = buildCacheRepository();

    it('should fetch the cache older than 5 minutes', async () => {
      const cache1 = cacheModule.generator.generate({
        updateDate: dateBuilder.minutesAgo(10),
      });
      const cache2 = cacheModule.generator.generate({
        updateDate: dateBuilder.minutesAgo(1),
      });
      await cacheRepository.insert(cache1);
      await cacheRepository.insert(cache2);

      const caches = await fetchAllOlderThan(5);

      expect(caches).toEqual([cache1]);
    });
  });
});
