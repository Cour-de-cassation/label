import { documentType, settingsType, statisticsCreator } from '@label/core';
import { assignationService } from '../../assignation';
import { treatmentService } from '../../treatment';
import { buildStatisticRepository } from '../repository';

export { saveStatisticsOfDocument };

async function saveStatisticsOfDocument(
  document: documentType,
  settings: settingsType,
) {
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
    settings,
    treatments,
  });

  await statisticRepository.insertMany(statistics);
}
