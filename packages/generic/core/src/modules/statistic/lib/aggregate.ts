import { groupBy } from 'lodash';
import { statisticType } from '../statisticType';

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
  cumulatedValue: Pick<
    statisticType,
    | 'addedAnnotationsCount'
    | 'deletedAnnotationsCount'
    | 'linkedEntitiesCount'
    | 'modifiedAnnotationsCount'
    | 'resizedBiggerAnnotationsCount'
    | 'resizedSmallerAnnotationsCount'
    | 'treatmentDuration'
  >;
  total: number;
} {
  return {
    cumulatedValue: statistics.reduce(
      (aggregatedStatistics, statistic) => ({
        addedAnnotationsCount: {
          sensitive: aggregatedStatistics.addedAnnotationsCount.sensitive + statistic.addedAnnotationsCount.sensitive,
          other: aggregatedStatistics.addedAnnotationsCount.other + statistic.addedAnnotationsCount.other,
        },
        deletedAnnotationsCount: {
          anonymised:
            aggregatedStatistics.deletedAnnotationsCount.anonymised + statistic.deletedAnnotationsCount.anonymised,
          other: aggregatedStatistics.deletedAnnotationsCount.other + statistic.deletedAnnotationsCount.other,
        },
        linkedEntitiesCount: aggregatedStatistics.linkedEntitiesCount + statistic.linkedEntitiesCount,
        modifiedAnnotationsCount: aggregatedStatistics.modifiedAnnotationsCount + statistic.modifiedAnnotationsCount,
        resizedBiggerAnnotationsCount:
          aggregatedStatistics.resizedBiggerAnnotationsCount + statistic.resizedBiggerAnnotationsCount,
        resizedSmallerAnnotationsCount:
          aggregatedStatistics.resizedSmallerAnnotationsCount + statistic.resizedSmallerAnnotationsCount,
        treatmentDuration: aggregatedStatistics.treatmentDuration + statistic.treatmentDuration,
      }),
      {
        addedAnnotationsCount: { sensitive: 0, other: 0 },
        deletedAnnotationsCount: { anonymised: 0, other: 0 },
        linkedEntitiesCount: 0,
        modifiedAnnotationsCount: 0,
        resizedBiggerAnnotationsCount: 0,
        resizedSmallerAnnotationsCount: 0,
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
