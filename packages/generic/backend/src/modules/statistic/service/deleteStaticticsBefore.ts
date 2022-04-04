import { dateBuilder } from '@label/core';
import { logger } from '../../../utils';
import { buildStatisticRepository } from '../repository';

export { deleteStaticticsBefore };

async function deleteStaticticsBefore({
  since,
  unit,
}: {
  since: number;
  unit: 'MONTHS';
}) {
  const statisticRepository = buildStatisticRepository();

  const statisticsExpirationDate = computeExpirationDate();
  const statisticToDeleteIds = await statisticRepository.findAllIdsBefore(
    statisticsExpirationDate,
  );

  const { count } = await statisticRepository.deleteManyByIds(
    statisticToDeleteIds,
  );

  logger.log(
    `deleteStaticticsBefore ${since}${unit}: ${count} statistics deleted`,
  );

  function computeExpirationDate() {
    switch (unit) {
      case 'MONTHS':
        return dateBuilder.monthsAgo(since);
    }
  }
}
