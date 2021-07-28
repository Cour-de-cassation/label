import {
  documentType,
  settingsType,
  statisticsCreator,
  treatmentModule,
} from '@label/core';
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
  if (assignations.length === 0) {
    return;
  }
  const treatments = await treatmentService.fetchTreatmentsByDocumentId(
    document._id,
  );

  const humanTreatments = treatmentModule.lib.extractHumanTreatments(
    treatments,
    assignations,
  );

  const statistic = statisticsCreator.buildFromDocument({
    document,
    treatments,
    humanTreatments,
    settings,
  });

  await statisticRepository.insert(statistic);
}
