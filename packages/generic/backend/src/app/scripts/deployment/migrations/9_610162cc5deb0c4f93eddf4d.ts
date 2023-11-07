import { groupBy, maxBy, omit, sumBy } from 'lodash';
import { idModule, treatmentType, userType } from '@label/core';
import { buildStatisticRepository } from '../../../../modules/statistic';
import { logger } from '../../../../utils';

export { up, down };

/* eslint-disable @typescript-eslint/no-unsafe-member-access*/
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
async function up() {
  logger.log({ operationName: 'migration', msg: 'Up: ' });

  const statisticRepository = buildStatisticRepository();

  const statistics = await statisticRepository.findAll();

  const aggregatedStatistics = Object.values(
    groupBy(statistics, (statistic) => statistic.documentExternalId),
  );
  await Promise.all(
    aggregatedStatistics.map(async (statisticsOnOneDocument) => {
      const treatmentsSummary = statisticsOnOneDocument.map(
        (statistic: any) => ({
          userId: statistic.userId as userType['_id'],
          treatmentDuration: statistic.treatmentDuration as treatmentType['duration'],
        }),
      );
      const newStatistic = {
        _id: idModule.lib.buildId(),
        addedAnnotationsCount: {
          sensitive: sumBy(
            statisticsOnOneDocument,
            (statistic) => (statistic as any).addedAnnotationsCount.sensitive,
          ),
          other: sumBy(
            statisticsOnOneDocument,
            (statistic) => (statistic as any).addedAnnotationsCount.other,
          ),
        },
        deletedAnnotationsCount: {
          anonymised: sumBy(
            statisticsOnOneDocument,
            (statistic) =>
              (statistic as any).deletedAnnotationsCount.anonymised,
          ),
          other: sumBy(
            statisticsOnOneDocument,
            (statistic) => (statistic as any).deletedAnnotationsCount.other,
          ),
        },
        modifiedAnnotationsCount: {
          nonAnonymisedToSensitive: sumBy(
            statisticsOnOneDocument,
            (statistic) =>
              (statistic as any).modifiedAnnotationsCount
                .nonAnonymisedToSensitive,
          ),
          anonymisedToNonAnonymised: sumBy(
            statisticsOnOneDocument,
            (statistic) =>
              (statistic as any).modifiedAnnotationsCount
                .anonymisedToNonAnonymised,
          ),
          other: sumBy(
            statisticsOnOneDocument,
            (statistic) => (statistic as any).modifiedAnnotationsCount.other,
          ),
        },
        resizedBiggerAnnotationsCount: {
          sensitive: sumBy(
            statisticsOnOneDocument,
            (statistic) =>
              (statistic as any).resizedBiggerAnnotationsCount.sensitive,
          ),
          other: sumBy(
            statisticsOnOneDocument,
            (statistic) =>
              (statistic as any).resizedBiggerAnnotationsCount.other,
          ),
        },
        resizedSmallerAnnotationsCount: {
          anonymised: sumBy(
            statisticsOnOneDocument,
            (statistic) =>
              (statistic as any).resizedSmallerAnnotationsCount.anonymised,
          ),
          other: sumBy(
            statisticsOnOneDocument,
            (statistic) =>
              (statistic as any).resizedSmallerAnnotationsCount.other,
          ),
        },
        linkedEntitiesCount: sumBy(
          statisticsOnOneDocument,
          (statistic) => statistic.linkedEntitiesCount,
        ),
        treatmentDate:
          maxBy(statisticsOnOneDocument, (statistic) => statistic.treatmentDate)
            ?.treatmentDate || 0,
        treatmentsSummary,
        annotationsCount: statisticsOnOneDocument[0].annotationsCount,
        documentExternalId: statisticsOnOneDocument[0].documentExternalId,
        wordsCount: statisticsOnOneDocument[0].wordsCount,
        source: statisticsOnOneDocument[0].source,
        publicationCategory: statisticsOnOneDocument[0].publicationCategory,
      } as any;

      await statisticRepository.insert(newStatistic);
      await statisticRepository.deleteManyByIds(
        statisticsOnOneDocument.map(({ _id }) => _id),
      );
    }),
  );
}

async function down() {
  logger.log({ operationName: 'migration', msg: 'Down: ' });

  const statisticRepository = buildStatisticRepository();

  const statistics = await statisticRepository.findAll();

  await Promise.all(
    statistics.map(async (statistic) => {
      const oldStatistics = (statistic as any).treatmentsSummary.map(
        (treatmentSummary: any) => {
          const oldStatistic = {
            ...omit(statistic, ['treatmentsSummary']),
            _id: idModule.lib.buildId(),
            userId: treatmentSummary.userId,
            treatmentDuration: treatmentSummary.treatmentDuration,
          };
          return oldStatistic;
        },
      );
      await statisticRepository.insertMany((oldStatistics as unknown) as any);
      await statisticRepository.deleteById(statistic._id);
    }),
  );
}
