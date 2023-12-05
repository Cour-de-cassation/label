import {
  dateBuilder,
  settingsType,
  statisticModule,
  userType,
} from '@label/core';
import { fetchFilteredStatistics } from './fetchFilteredStatistics';

export { fetchPersonalStatistics };

async function fetchPersonalStatistics(user: userType, settings: settingsType) {
  const filter = {
    userId: user._id,
    mustHaveSurAnnotations: false,
    mustHaveSubAnnotations: false,
    publicationCategory: undefined,
    startDate: dateBuilder.daysAgo(10),
    endDate: new Date().getTime(),
    route: undefined,
    source: undefined,
    importer: undefined,
    jurisdiction: undefined,
  };

  const statistics = await fetchFilteredStatistics(filter, settings);
  const personalStatistics = statisticModule.lib.dailyCount(statistics);

  return Object.values(personalStatistics);
}
