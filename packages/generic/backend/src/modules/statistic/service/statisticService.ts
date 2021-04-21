import { fetchAggregatedStatisticsAccordingToFilter } from './fetchAggregatedStatisticsAccordingToFilter';
import { fetchAvailableStatisticFilters } from './fetchAvailableStatisticFilters';
import { saveStatisticsOfDocument } from './saveStatisticsOfDocument';

export { statisticService };

const statisticService = {
  fetchAggregatedStatisticsAccordingToFilter,
  fetchAvailableStatisticFilters,
  saveStatisticsOfDocument,
};
