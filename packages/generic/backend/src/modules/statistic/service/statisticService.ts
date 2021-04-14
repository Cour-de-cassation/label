import { documentType, statisticModule, statisticsCreator } from '@label/core';
import { assignationService } from '../../assignation';
import { treatmentService } from '../../treatment';
import { buildStatisticRepository } from '../repository';

export { statisticService };

const statisticService = {
  async fetchAll() {
    return [10, 20, 30, 40, 50].map((value) =>
      statisticModule.generator.generate({
        addedAnnotationsCount: value,
        deletedAnnotationsCount: value,
        modifiedAnnotationsCount: value,
        resizedBiggerAnnotationsCount: value,
        resizedSmallerAnnotationsCount: value,
        treatmentDuration: 3000,
      }),
    );
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
