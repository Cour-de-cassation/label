import { cacheType, timeOperator } from '@label/core';
import { buildCacheRepository } from '../../modules/cache';
import { logger } from '../../utils';

export { listAllCaches };

async function listAllCaches() {
  logger.log({ operationName: 'listAllCaches', msg: 'START' });

  const cacheRepository = buildCacheRepository();

  const caches = await cacheRepository.findAll();
  logger.log({
    operationName: 'listAllCaches',
    msg: `${caches.length} caches found`,
  });
  for (let index = 0; index < caches.length; index++) {
    const cache = caches[index] as cacheType;
    logger.log({
      operationName: 'listAllCaches',
      msg: `${index + 1} | ${cache['key']} | ${
        cache['updateDate'] &&
        timeOperator.convertTimestampToReadableDate(cache['updateDate'])
      } | ${cache['content']}`,
    });
  }

  logger.log({ operationName: 'listAllCaches', msg: 'DONE' });
}
