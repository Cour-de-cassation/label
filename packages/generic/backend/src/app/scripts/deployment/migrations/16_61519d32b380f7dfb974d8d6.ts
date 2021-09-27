import { buildStatisticRepository } from '../../../../modules/statistic';
import { logger } from '../../../../utils';

export { up, down };

async function up() {
  logger.log('Up: ');

  const statisticRepository = buildStatisticRepository();

  const statistics = await statisticRepository.findAll();

  await Promise.all(
    statistics.map((statistic) =>
      statisticRepository.updateOne(statistic._id, {
        jurisdiction: undefined,
      }),
    ),
  );
}

async function down() {
  logger.log('Down: ');

  const statisticRepository = buildStatisticRepository();

  await statisticRepository.deletePropertiesForMany({}, ['jurisdiction']);
}
