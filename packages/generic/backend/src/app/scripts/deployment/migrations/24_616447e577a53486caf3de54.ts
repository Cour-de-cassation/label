import { buildStatisticRepository } from '../../../../modules/statistic';
import { logger } from '../../../../utils';

export { up, down };

async function up() {
  logger.log({ operationName: 'migration', msg: 'Up: ' });

  const statisticRepository = buildStatisticRepository();

  const statistics = await statisticRepository.findAll();

  await Promise.all(
    statistics.map((statistic) =>
      statisticRepository.updateOne(statistic._id, {
        jurisdiction: !!statistic.jurisdiction
          ? statistic.jurisdiction.toLowerCase()
          : undefined,
        chamberName: undefined,
        session: undefined,
      }),
    ),
  );
}

async function down() {
  logger.log({ operationName: 'migration', msg: 'Down: ' });

  const statisticRepository = buildStatisticRepository();

  const statistics = await statisticRepository.findAll();

  await Promise.all(
    statistics.map((statistic) =>
      statisticRepository.updateOne(statistic._id, {
        jurisdiction: !!statistic.jurisdiction
          ? statistic.jurisdiction.toLowerCase()
          : undefined,
      }),
    ),
  );

  await statisticRepository.deletePropertiesForMany({}, [
    'chamberName',
    'session',
  ]);
}
