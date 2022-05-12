import { cacheType } from '@label/core';
import { cacheService } from '../../modules/cache';
import { statisticService } from '../../modules/statistic';

export { renewCache };

async function renewCache({ minutes }: { minutes: number }) {
  const caches = await cacheService.fetchAllOlderThan(minutes);
  caches.forEach(async (cache: cacheType) => {
    await cacheService.deleteCache(cache._id);
    switch (cache.key) {
      case 'availableStatisticFilters':
        await cacheService.createCache(
          cache.key,
          await statisticService.fetchAvailableStatisticFilters(),
        );
        break;
    }
  });
}
