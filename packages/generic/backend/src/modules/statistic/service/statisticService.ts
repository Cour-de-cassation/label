import {
  documentType,
  ressourceFilterType,
  statisticModule,
  statisticsCreator,
} from '@label/core';
import { assignationService } from '../../assignation';
import { treatmentService } from '../../treatment';
import { buildStatisticRepository } from '../repository';

export { statisticService };

const statisticService = {
  async fetchAccordingToFilter(filter: ressourceFilterType) {
    const statisticRepository = buildStatisticRepository();

    const statistics = await statisticRepository.findAllByRessourceFilter(
      filter,
    );

    return statisticModule.lib.aggregate(statistics);
  },

  async saveStatisticsOfDocument(document: documentType) {
    const statisticRepository = buildStatisticRepository();

    const assignations = await assignationService.fetchAssignationsOfDocumentId(
      document._id,
    );
    const treatments = await treatmentService.fetchTreatmentsByDocumentId(
      document._id,
    );

    const statistics = statisticsCreator.buildFromDocument({
      assignations,
      document,
      treatments,
    });

    await statisticRepository.insertMany(statistics);
  },
};
