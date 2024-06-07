import { dateBuilder, statisticModule } from '@label/core';
import { buildStatisticRepository } from '../repository';
import { deleteTreatmentsSummaryBefore } from './deleteTreatmentsSummaryBefore';

describe('deleteTreatmentsSummaryBefore', () => {
  const statisticRepository = buildStatisticRepository();

  it('should delete all the treatments summary from statistics before the given time', async () => {
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

    await deleteTreatmentsSummaryBefore({ since: 2, unit: 'MONTHS' });

    const statisticsAfterDeletion = await statisticRepository.findAll();

    expect(statisticsAfterDeletion[0].treatmentsSummary).toEqual([]);
    expect(statisticsAfterDeletion[1].treatmentsSummary).toEqual(
      statistics[1].treatmentsSummary,
    );
    expect(statisticsAfterDeletion[2].treatmentsSummary).toEqual([]);
  });
});
