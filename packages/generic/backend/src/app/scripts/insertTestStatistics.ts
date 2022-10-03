import { dateBuilder, statisticModule } from '@label/core';
import { buildStatisticRepository } from '../../modules/statistic';
import { userService } from '../../modules/user';

export { insertTestStatistics };

async function insertTestStatistics() {
  const statisticRepository = buildStatisticRepository();

  const users = await userService.fetchWorkingUsers();

  for (const user of users) {
    for (let i = 0; i < 100; i++) {
      await statisticRepository.insert(
        statisticModule.generator.generate({
          treatmentsSummary: [{ userId: user._id, treatmentDuration: 10 }],
          route: 'simple',
          treatmentDate: dateBuilder.daysAgo(i),
        }),
      );

      await statisticRepository.insert(
        statisticModule.generator.generate({
          treatmentsSummary: [{ userId: user._id, treatmentDuration: 20 }],
          route: 'exhaustive',
          treatmentDate: dateBuilder.daysAgo(i),
        }),
      );

      await statisticRepository.insert(
        statisticModule.generator.generate({
          treatmentsSummary: [{ userId: user._id, treatmentDuration: 30 }],
          route: 'confirmation',
          treatmentDate: dateBuilder.daysAgo(i),
        }),
      );
    }
  }
}
