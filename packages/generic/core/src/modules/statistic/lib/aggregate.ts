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
    surAnnotationsCompleteCount: number;
    surAnnotationsPartialCount: number;
    subAnnotationsCompleteCount: number;
    subAnnotationsPartialCount: number;
    treatmentDuration: statisticType['treatmentDuration'];
  };
  total: number;
} {
  return {
    cumulatedValue: statistics.reduce(
      (aggregatedStatistics, statistic) => {
        const simplifyedStatistic = simplify(statistic);
        return {
          surAnnotationsCompleteCount:
            aggregatedStatistics.surAnnotationsCompleteCount + simplifyedStatistic.surAnnotationsCompleteCount,
          surAnnotationsPartialCount:
            aggregatedStatistics.surAnnotationsPartialCount + simplifyedStatistic.surAnnotationsPartialCount,
          subAnnotationsCompleteCount:
            aggregatedStatistics.subAnnotationsCompleteCount + simplifyedStatistic.subAnnotationsCompleteCount,
          subAnnotationsPartialCount:
            aggregatedStatistics.subAnnotationsPartialCount + simplifyedStatistic.subAnnotationsPartialCount,
          treatmentDuration: aggregatedStatistics.treatmentDuration + statistic.treatmentDuration,
        };
      },
      {
        surAnnotationsCompleteCount: 0,
        surAnnotationsPartialCount: 0,
        subAnnotationsCompleteCount: 0,
        subAnnotationsPartialCount: 0,
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
