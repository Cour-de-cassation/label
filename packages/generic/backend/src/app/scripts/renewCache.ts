import { cacheType } from '@label/core';
import { cacheService } from '../../modules/cache';
import { statisticService } from '../../modules/statistic';
import { logger } from '../../utils';

export { renewCache };

async function renewCache({ minutes }: { minutes: number }) {
  logger.log(`renewCache`);
  const cachesToRenew: cacheType[] = await cacheService.fetchAllOlderThan(
    minutes,
  );
  logger.log(`${cachesToRenew.length} caches to renew.`);

  const availableStatisticFiltersCaches = await cacheService.fetchAllByKey(
    'availableStatisticFilters',
  );
  if (
    !availableStatisticFiltersCaches.length ||
    cachesToRenew.some((cache) => cache.key == 'availableStatisticFilters')
  ) {
    await cacheService.createCache(
      'availableStatisticFilters',
      JSON.stringify(await statisticService.fetchAvailableStatisticFilters()),
    );
    logger.log(`availableStatisticFilters cache renewed.`);
  }

  cachesToRenew.forEach(async (cache) => {
    await cacheService.deleteCache(cache._id);
    logger.log(`${cache._id} ${cache.key} cache deleted.`);
  });

  logger.log('Done');
}
