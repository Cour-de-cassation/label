import { buildStatisticRepository } from '../../../../modules/statistic';
import { logger } from '../../../../utils';

export { up, down };

async function up() {
  logger.log('Up: ');

  const statisticRepository = buildStatisticRepository();
  const statistics = await statisticRepository.findAll();

  await Promise.all(
    statistics.map((statistic) => {
      return statisticRepository.updateOne(statistic._id, {
        addedAnnotationsCount: {
          sensitive: 0,
          other: (statistic.addedAnnotationsCount as unknown) as number,
        },
        deletedAnnotationsCount: {
          anonymised: 0,
          other: (statistic.deletedAnnotationsCount as unknown) as number,
        },
      });
    }),
  );
}

async function down() {
  logger.log('Down: ');

  const statisticRepository = buildStatisticRepository();
  const statistics = await statisticRepository.findAll();

  await Promise.all(
    statistics.map((statistic) => {
      return statisticRepository.updateOne(statistic._id, {
        addedAnnotationsCount:
          statistic.addedAnnotationsCount.sensitive +
          statistic.addedAnnotationsCount.other,
        deletedAnnotationsCount:
          statistic.deletedAnnotationsCount.anonymised +
          statistic.deletedAnnotationsCount.other,
      } as any);
    }),
  );
}
