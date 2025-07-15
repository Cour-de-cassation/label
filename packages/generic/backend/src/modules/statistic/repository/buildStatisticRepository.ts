import { documentType, statisticType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { buildRessourceFilterRequest } from '../../ressourceFilter';
import { customStatisticRepositoryType } from './customStatisticRepositoryType';

export { buildStatisticRepository };

const buildStatisticRepository = buildRepositoryBuilder<
  statisticType,
  customStatisticRepositoryType
>({
  collectionName: 'statistics',
  indexes: [
    { index: { source: 1 } },
    { index: { subAnnotationsSensitiveCount: 1 } },
    { index: { surAnnotationsCount: 1 } },
    { index: { publicationCategory: 1 } },
    { index: { treatmentDate: 1 } },
    { index: { jurisdiction: 1 } },
    { index: { source: 1, treatmentDate: 1 } },
    { index: { source: 1, treatmentDate: -1 } }
  ],
  buildCustomRepository: (collection) => ({
    async findAllStatisticsByDocumentNumber(
      documentNumber: documentType['documentNumber'],
    ) {
      const statisticDocument = await collection
        .find({ documentNumber: { $eq: documentNumber } })
        .toArray();
      return statisticDocument;
    },

    async findAllByRessourceFilter(ressourceFilter) { // On ajoutera un agrégat pour éviter de faire trop de requêtes, cependant la confugration de l'agrégat est complexe dans le contexte de Label
      try {
        const ressourceFilterRequest = buildRessourceFilterRequest(ressourceFilter);

        const sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000;

        const query = {
          ...ressourceFilterRequest,
          treatmentDate: {
            ...(ressourceFilterRequest.treatmentDate || {}),
            $gte: sixMonthsAgo,
          },
        };

        return collection.find(query).toArray();
      } catch (error) {
        console.error('Error in findAllByRessourceFilter:', error);
        throw error;
      }
    },

    async findAllIdsBefore(date) {
      const statistics = await collection
        .find({ treatmentDate: { $lte: date } })
        .project({ _id: 1 })
        .toArray();

      return statistics.map((statistic) => statistic._id);
    },

    async findExtremumTreatmentDateBySources(sources) {
      try {
        const sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in milliseconds

        const minDateStatistics = await collection
          .find({
            source: { $in: sources },
            treatmentDate: { $gte: sixMonthsAgo },
          })
          .sort({ treatmentDate: 1 })
          .limit(1)
          .toArray();

        const maxDateStatistics = await collection
          .find({
            source: { $in: sources },
            treatmentDate: { $gte: sixMonthsAgo },
          })
          .sort({ treatmentDate: -1 })
          .limit(1)
          .toArray();

        return {
          minDate: minDateStatistics[0]?.treatmentDate,
          maxDate: maxDateStatistics[0]?.treatmentDate,
        };
      } catch (error) {
        console.error('Error in findExtremumTreatmentDateBySources:', error);
        throw error;
      }
    },

    async deleteTreatmentsSummaryByIds(ids) {
      const result = await collection.updateMany(
        {
          _id: { $in: ids },
        },
        {
          $unset: { 'treatmentsSummary.$[].userId': '' },
        },
      );
      return result.modifiedCount;
    },

    async findRecentStatisticsProjection(projections) {
      const sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in milliseconds
      return await collection
        .find({ treatmentDate: { $gte: sixMonthsAgo } })
        .project(projections)
        .toArray();
    },
  }),
});
