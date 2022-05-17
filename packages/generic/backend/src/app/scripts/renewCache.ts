import { cacheType } from '@label/core';
import { cacheService } from '../../modules/cache';
import { statisticService } from '../../modules/statistic';
import { logger } from '../../utils';

export { renewCache };

async function renewCache({ minutes }: { minutes: number }) {
  logger.log(`renewCache`);

  const caches = await cacheService.fetchAllOlderThan(minutes);
  caches.forEach(async (cache: cacheType) => {
    await cacheService.deleteCache(cache._id);
    logger.log(`${cache.key} cache deleted.`);
  });

  const availableStatisticFiltersCaches = await cacheService.fetchAllByKey(
    'availableStatisticFilters',
  );
  if (!availableStatisticFiltersCaches.length) {
    await cacheService.createCache(
      'availableStatisticFilters',
      JSON.stringify(await statisticService.fetchAvailableStatisticFilters()),
    );
    logger.log(`availableStatisticFilters cache renewed.`);
  }

  logger.log('Done');
}
