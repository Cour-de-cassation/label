import { buildStatisticRepository } from '../../../../modules/statistic';

export { addTreatmentDateInStatisticModel };

const MIGRATION_DATE = new Date(2021, 3, 30, 0, 0, 0);

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
async function addTreatmentDateInStatisticModel() {
  const statisticRepository = buildStatisticRepository();

  const statistics = await statisticRepository.findAll();

  const statisticsWithNewDataModel = statistics.map((statistic) => ({
    ...statistic,
    treatmentDate: MIGRATION_DATE.getTime(),
  }));

  await statisticRepository.clear();

  await Promise.all(statisticsWithNewDataModel.map(statisticRepository.insert));
}
