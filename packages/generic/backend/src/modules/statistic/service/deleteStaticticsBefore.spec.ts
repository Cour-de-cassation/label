import { statisticModule } from '@label/core';
import { dateBuilder } from '../../../utils';
import { buildStatisticRepository } from '../repository';
import { deleteStaticticsBefore } from './deleteStaticticsBefore';

describe('deleteStaticticsBefore', () => {
  const statisticRepository = buildStatisticRepository();

  it('should delete all the statistics before the given time', async () => {
    const statistics = [
      {
        treatmentDate: dateBuilder.monthsAgo(3),
      },
      {
        treatmentDate: dateBuilder.monthsAgo(1),
      },
      {
        treatmentDate: dateBuilder.monthsAgo(2),
      },
    ].map(statisticModule.generator.generate);
    await Promise.all(statistics.map(statisticRepository.insert));

    await deleteStaticticsBefore({ since: 2, unit: 'MONTHS' });

    const statisticsAfterDeletion = await statisticRepository.findAll();
    expect(statisticsAfterDeletion).toEqual([statistics[1]]);
  });
});
