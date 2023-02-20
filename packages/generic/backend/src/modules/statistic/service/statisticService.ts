import { deleteStaticticsBefore } from './deleteStaticticsBefore';
import { fetchAggregatedStatisticsAccordingToFilter } from './fetchAggregatedStatisticsAccordingToFilter';
import { fetchAvailableStatisticFilters } from './fetchAvailableStatisticFilters';
import { fetchFilteredStatistics } from './fetchFilteredStatistics';
import { fetchPersonalStatistics } from './fetchPersonalStatistics';
import { fetchSummary } from './fetchSummary';
import { saveStatisticsOfDocument } from './saveStatisticsOfDocument';

export { statisticService };

const statisticService = {
  deleteStaticticsBefore,
  fetchAggregatedStatisticsAccordingToFilter,
  fetchAvailableStatisticFilters,
  fetchFilteredStatistics,
  fetchPersonalStatistics,
  fetchSummary,
  saveStatisticsOfDocument,
};
