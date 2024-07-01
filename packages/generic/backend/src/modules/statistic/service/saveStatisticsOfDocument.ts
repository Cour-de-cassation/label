import {
  documentType,
  settingsType,
  statisticsCreator,
  treatmentModule,
} from '@label/core';
import { assignationService } from '../../assignation';
import { treatmentService } from '../../treatment';
import { buildStatisticRepository } from '../repository';
import { logger } from '../../../utils';
import { userService } from 'src/modules/user';

export { saveStatisticsOfDocument };

async function saveStatisticsOfDocument(
  document: documentType,
  settings: settingsType,
) {
  const statisticRepository = buildStatisticRepository();

  const treatments = await treatmentService.fetchTreatmentsByDocumentId(
    document._id,
  );

  const assignations = await assignationService.fetchAssignationsOfDocumentId(
    document._id,
  );
  let humanTreatments;
  if (assignations.length !== 0) {
    humanTreatments = treatmentModule.lib.extractHumanTreatments(
      treatments,
      assignations,
    );
  }

  const statistic = statisticsCreator.buildFromDocument({
    document,
    treatments,
    humanTreatments,
    settings,
  });

  if (humanTreatments && humanTreatments.length > 0) {
    humanTreatments.forEach(async (humanTreatment) => {
      const user = await userService.fetchUsersByIds([humanTreatment.userId]);
      logger.log({
        operationName: 'documentStatistics',
        msg: `Human treatment for document ${document.source}:${document.documentNumber} : ${user.name} treat document in ${humanTreatment.treatment.duration}`,
      });
    });
  }

  logger.log({
    operationName: 'documentStatistics',
    msg: `Create statistics for document ${document.source}:${document.documentNumber}`,
    data: { statistic },
  });

  await statisticRepository.insert(statistic);
}
