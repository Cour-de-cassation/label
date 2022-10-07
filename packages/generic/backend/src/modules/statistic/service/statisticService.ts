import { deleteStaticticsBefore } from './deleteStaticticsBefore';
import { fetchAggregatedStatisticsAccordingToFilter } from './fetchAggregatedStatisticsAccordingToFilter';
import { fetchAvailableStatisticFilters } from './fetchAvailableStatisticFilters';
import { fetchPersonalStatistics } from './fetchPersonalStatistics';
import { saveStatisticsOfDocument } from './saveStatisticsOfDocument';

export { statisticService };

const statisticService = {
  deleteStaticticsBefore,
  fetchAggregatedStatisticsAccordingToFilter,
  fetchAvailableStatisticFilters,
  fetchPersonalStatistics,
  saveStatisticsOfDocument,
};
