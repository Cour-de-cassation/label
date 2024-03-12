import { sum, sumBy } from 'lodash';
import { idModule } from '../../id';
import { ressourceFilterType } from '../../ressourceFilter';
import { statisticType } from '../statisticType';

export { aggregate };

function aggregate(statistics: statisticType[], filter: ressourceFilterType) {
  return {
    cumulatedValue: statistics.reduce(
      (aggregatedStatistics, statistic) => {
        const { userId: userIdToFilter } = filter;
        const treatmentDuration = userIdToFilter
          ? aggregatedStatistics.treatmentDuration +
            sum(
              statistic.treatmentsSummary
                .filter(({ userId }) => idModule.lib.equalId(userId, userIdToFilter))
                .map(({ treatmentDuration }) => treatmentDuration),
            )
          : aggregatedStatistics.treatmentDuration +
            sumBy(statistic.treatmentsSummary, ({ treatmentDuration }) => treatmentDuration);
        return {
          annotationsCount: aggregatedStatistics.annotationsCount + statistic.annotationsCount,
          wordsCount: aggregatedStatistics.wordsCount + statistic.wordsCount,
          surAnnotationsCount: aggregatedStatistics.surAnnotationsCount + statistic.surAnnotationsCount,
          subAnnotationsSensitiveCount:
            aggregatedStatistics.subAnnotationsSensitiveCount + statistic.subAnnotationsSensitiveCount,
          subAnnotationsNonSensitiveCount:
            aggregatedStatistics.subAnnotationsNonSensitiveCount + statistic.subAnnotationsNonSensitiveCount,
          treatmentDuration,
        };
      },
      {
        surAnnotationsCount: 0,
        subAnnotationsSensitiveCount: 0,
        subAnnotationsNonSensitiveCount: 0,
        treatmentDuration: 0,
        annotationsCount: 0,
        wordsCount: 0,
      },
    ),
    total: statistics.length,
  };
}
