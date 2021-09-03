import { groupBy, maxBy, omit, sumBy } from 'lodash';
import { idModule, statisticType, treatmentType, userType } from '@label/core';
import { buildStatisticRepository } from '../../../../modules/statistic';
import { logger } from '../../../../utils';

export { up, down };

async function up() {
  logger.log('Up: ');

  const statisticRepository = buildStatisticRepository();

  const statistics = await statisticRepository.findAll();

  const aggregatedStatistics = Object.values(
    groupBy(statistics, (statistic) => statistic.documentExternalId),
  );
  await Promise.all(
    aggregatedStatistics.map(async (statisticsOnOneDocument) => {
      const treatmentsSummary = statisticsOnOneDocument.map(
        (statistic: any) => ({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          userId: statistic.userId as userType['_id'],
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          treatmentDuration: statistic.treatmentDuration as treatmentType['duration'],
        }),
      );
      const newStatistic = {
        _id: idModule.lib.buildId(),
        addedAnnotationsCount: {
          sensitive: sumBy(
            statisticsOnOneDocument,
            (statistic) => statistic.addedAnnotationsCount.sensitive,
          ),
          other: sumBy(
            statisticsOnOneDocument,
            (statistic) => statistic.addedAnnotationsCount.other,
          ),
        },
        deletedAnnotationsCount: {
          anonymised: sumBy(
            statisticsOnOneDocument,
            (statistic) => statistic.deletedAnnotationsCount.anonymised,
          ),
          other: sumBy(
            statisticsOnOneDocument,
            (statistic) => statistic.deletedAnnotationsCount.other,
          ),
        },
        modifiedAnnotationsCount: {
          nonAnonymisedToSensitive: sumBy(
            statisticsOnOneDocument,
            (statistic) =>
              statistic.modifiedAnnotationsCount.nonAnonymisedToSensitive,
          ),
          anonymisedToNonAnonymised: sumBy(
            statisticsOnOneDocument,
            (statistic) =>
              statistic.modifiedAnnotationsCount.anonymisedToNonAnonymised,
          ),
          other: sumBy(
            statisticsOnOneDocument,
            (statistic) => statistic.modifiedAnnotationsCount.other,
          ),
        },
        resizedBiggerAnnotationsCount: {
          sensitive: sumBy(
            statisticsOnOneDocument,
            (statistic) => statistic.resizedBiggerAnnotationsCount.sensitive,
          ),
          other: sumBy(
            statisticsOnOneDocument,
            (statistic) => statistic.resizedBiggerAnnotationsCount.other,
          ),
        },
        resizedSmallerAnnotationsCount: {
          anonymised: sumBy(
            statisticsOnOneDocument,
            (statistic) => statistic.resizedSmallerAnnotationsCount.anonymised,
          ),
          other: sumBy(
            statisticsOnOneDocument,
            (statistic) => statistic.resizedSmallerAnnotationsCount.other,
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
      } as statisticType;

      await statisticRepository.insert(newStatistic);
      await statisticRepository.deleteManyByIds(
        statisticsOnOneDocument.map(({ _id }) => _id),
      );
    }),
  );
}

async function down() {
  logger.log('Down: ');

  const statisticRepository = buildStatisticRepository();

  const statistics = await statisticRepository.findAll();

  await Promise.all(
    statistics.map(async (statistic) => {
      const oldStatistics = statistic.treatmentsSummary.map(
        (treatmentSummary) => {
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
