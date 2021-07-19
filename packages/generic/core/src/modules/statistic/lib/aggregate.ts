import { groupBy } from 'lodash';
import { statisticType } from '../statisticType';
import { simplify } from './simplify';

export { aggregate };

function aggregate(statistics: statisticType[]) {
  return {
    perAssignation: aggregatePerAssignation(statistics),
    perDocument: aggregatePerDocument(statistics),
  };
}

function aggregatePerAssignation(
  statistics: statisticType[],
): {
  cumulatedValue: {
    surAnnotationsCount: number;
    subAnnotationsSensitiveCount: number;
    subAnnotationsNonSensitiveCount: number;
    treatmentDuration: statisticType['treatmentDuration'];
  };
  total: number;
} {
  return {
    cumulatedValue: statistics.reduce(
      (aggregatedStatistics, statistic) => {
        const simplifyedStatistic = simplify(statistic);
        return {
          surAnnotationsCount: aggregatedStatistics.surAnnotationsCount + simplifyedStatistic.surAnnotationsCount,
          subAnnotationsSensitiveCount:
            aggregatedStatistics.subAnnotationsSensitiveCount + simplifyedStatistic.subAnnotationsSensitiveCount,
          subAnnotationsNonSensitiveCount:
            aggregatedStatistics.subAnnotationsNonSensitiveCount + simplifyedStatistic.subAnnotationsNonSensitiveCount,
          treatmentDuration: aggregatedStatistics.treatmentDuration + statistic.treatmentDuration,
        };
      },
      {
        surAnnotationsCount: 0,
        subAnnotationsSensitiveCount: 0,
        subAnnotationsNonSensitiveCount: 0,
        treatmentDuration: 0,
      },
    ),
    total: statistics.length,
  };
}

function aggregatePerDocument(
  statistics: statisticType[],
): {
  cumulatedValue: Pick<statisticType, 'annotationsCount' | 'wordsCount'>;
  total: number;
} {
  const documentStatistics = Object.values(groupBy(statistics, (statistic) => statistic.documentExternalId)).map(
    (statistics) => statistics[0],
  );

  return {
    cumulatedValue: documentStatistics.reduce(
      (aggregatedStatistics, statistic) => ({
        annotationsCount: aggregatedStatistics.annotationsCount + statistic.annotationsCount,
        wordsCount: aggregatedStatistics.wordsCount + statistic.wordsCount,
      }),
      {
        annotationsCount: 0,
        wordsCount: 0,
      },
    ),
    total: documentStatistics.length,
  };
}
