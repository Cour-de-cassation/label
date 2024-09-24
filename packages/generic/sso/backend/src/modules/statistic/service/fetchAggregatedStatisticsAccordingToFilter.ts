import {
  ressourceFilterType,
  settingsType,
  statisticModule,
} from '@label/core';
import { fetchFilteredStatistics } from './fetchFilteredStatistics';

export { fetchAggregatedStatisticsAccordingToFilter };

async function fetchAggregatedStatisticsAccordingToFilter(
  filter: ressourceFilterType,
  settings: settingsType,
) {
  const statistics = await fetchFilteredStatistics(filter, settings);
  return statisticModule.lib.aggregate(statistics, filter);
}
