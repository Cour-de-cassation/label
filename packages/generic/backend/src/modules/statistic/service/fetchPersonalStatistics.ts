import { dateBuilder, statisticModule, userType } from '@label/core';
import { buildStatisticRepository } from '../repository';

export { fetchPersonalStatistics };

async function fetchPersonalStatistics(user: userType) {
  const filter = {
    userId: user._id,
    mustHaveSurAnnotations: false,
    mustHaveSubAnnotations: false,
    publicationCategory: undefined,
    startDate: dateBuilder.daysAgo(10),
    endDate: new Date().getTime(),
    route: undefined,
    importer: undefined,
    source: undefined,
    jurisdiction: undefined,
  };

  const statisticRepository = buildStatisticRepository();
  const statistics = await statisticRepository.findAllByRessourceFilter(filter);
  const personalStatistics = statisticModule.lib.dailyCount(statistics);

  return Object.values(personalStatistics);
}
