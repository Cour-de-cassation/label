import { cacheType } from '@label/core';
import { cacheService } from '../../modules/cache';
import { statisticService } from '../../modules/statistic';
import { logger } from '../../utils';

export { renewCache };

async function renewCache({ minutes }: { minutes: number }) {
  logger.log({ operationName: 'renewCache', msg: 'START' });
  const cachesToRenew: cacheType[] = await cacheService.fetchAllOlderThan(
    minutes,
  );
  logger.log({
    operationName: 'renewCache',
    msg: `${cachesToRenew.length} caches to renew`,
  });

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
    logger.log({
      operationName: 'renewCache',
      msg: `availableStatisticFilters cache renewed`,
    });
  }

  for (const cache of cachesToRenew) {
    await cacheService.deleteCache(cache._id);
    logger.log({
      operationName: 'renewCache',
      msg: `${cache._id} ${cache.key} cache deleted`,
    });
  }

  logger.log({ operationName: 'renewCache', msg: 'DONE' });
}
