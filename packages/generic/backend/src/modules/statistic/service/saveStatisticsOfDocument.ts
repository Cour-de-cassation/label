import { documentType, statisticsCreator } from '@label/core';
import { assignationService } from '../../assignation';
import { treatmentService } from '../../treatment';
import { buildStatisticRepository } from '../repository';

export { saveStatisticsOfDocument };

async function saveStatisticsOfDocument(document: documentType) {
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
}
