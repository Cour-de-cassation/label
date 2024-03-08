import { documentType, statisticType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { buildRessourceFilterRequest } from '../../ressourceFilter';
import { customStatisticRepositoryType } from './customStatisticRepositoryType';
import { logger } from '../../../utils';
import { dumpDocument } from 'src/app/scripts';

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
  ],
  buildCustomRepository: (collection) => ({

    //fetch statistics by documentNumber
    async findAllStatisticsByDocumentNumber(documentNumber: documentType['documentNumber']) {
      logger.log({ operationName: "doucmentNUmber", msg: `le documentNumber : ${documentNumber}` })
      const statisticDocument = await collection.find({ documentNumber: { $eq: documentNumber } }).toArray();
      logger.log({ operationName: "logStatisticDocument", msg: `les statistiques : ${statisticDocument}` })
      return statisticDocument;
    },

    async findAllByRessourceFilter(ressourceFilter) {
      const ressourceFilterRequest = buildRessourceFilterRequest(
        ressourceFilter,
      );

      return collection.find(ressourceFilterRequest).toArray();
    },

    async findAllIdsBefore(date) {
      const statistics = await collection
        .find({ treatmentDate: { $lte: date } })
        .project({ _id: 1 })
        .toArray();

      return statistics.map((statistic) => statistic._id);
    },

    async findExtremumTreatmentDateBySources(sources) {
      const minDateStatistics = await collection
        .find({ source: { $in: sources } })
        .sort({ treatmentDate: 1 })
        .limit(1)
        .toArray();

      const maxDateStatistics = await collection
        .find({ source: { $in: sources } })
        .sort({ treatmentDate: -1 })
        .limit(1)
        .toArray();

      return {
        minDate: minDateStatistics[0]?.treatmentDate,
        maxDate: maxDateStatistics[0]?.treatmentDate,
      };
    },
  }),
});
