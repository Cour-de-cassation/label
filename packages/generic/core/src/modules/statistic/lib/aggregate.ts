import { sum, sumBy } from 'lodash';
import { idModule } from '../../id';
import { ressourceFilterType } from '../../ressourceFilter';
import { statisticType } from '../statisticType';
import { simplify } from './simplify';

export { aggregate };

function aggregate(statistics: statisticType[], filter: ressourceFilterType) {
  return {
    cumulatedValue: statistics.reduce(
      (aggregatedStatistics, statistic) => {
        const simplifyedStatistic = simplify(statistic);
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
          surAnnotationsCount: aggregatedStatistics.surAnnotationsCount + simplifyedStatistic.surAnnotationsCount,
          subAnnotationsSensitiveCount:
            aggregatedStatistics.subAnnotationsSensitiveCount + simplifyedStatistic.subAnnotationsSensitiveCount,
          subAnnotationsNonSensitiveCount:
            aggregatedStatistics.subAnnotationsNonSensitiveCount + simplifyedStatistic.subAnnotationsNonSensitiveCount,
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
