import { dateBuilder } from '../../../utils';
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

  await statisticRepository.deleteManyByIds(statisticToDeleteIds);

  function computeExpirationDate() {
    switch (unit) {
      case 'MONTHS':
        return dateBuilder.monthsAgo(since);
    }
  }
}
