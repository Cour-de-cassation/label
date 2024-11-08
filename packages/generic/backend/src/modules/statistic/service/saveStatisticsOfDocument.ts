import {
  annotationReportType,
  documentType,
  idModule,
  settingsType,
  statisticsCreator,
  timeOperator,
  treatmentModule,
} from '@label/core';
import { assignationService } from '../../assignation';
import { treatmentService } from '../../treatment';
import { buildStatisticRepository } from '../repository';
import { logger } from '../../../utils';
import { userService } from '../../../modules/user';

export { saveStatisticsOfDocument };

async function saveStatisticsOfDocument(
  document: documentType,
  settings: settingsType,
  checklist: annotationReportType['checklist'],
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
    checklist: checklist,
    settings,
  });

  if (humanTreatments && humanTreatments.length > 0) {
    const userIds = humanTreatments.map((humanTreatment) =>
      idModule.lib.buildId(humanTreatment.userId),
    );
    const users = await userService.fetchUsersByIds(userIds);

    for (const humanTreatment of humanTreatments) {
      const user = users[idModule.lib.convertToString(humanTreatment.userId)];

      if (user) {
        logger.log({
          operationName: 'documentStatistics',
          msg: `Human treatment for document ${document.source}:${
            document.documentNumber
          } : ${
            user.name
          } treat the document in ${timeOperator.convertDurationToReadableDuration(
            humanTreatment.treatment.duration,
          )} on ${timeOperator.convertTimestampToReadableDate(
            humanTreatment.treatment.lastUpdateDate,
            true,
          )}`,
          data: {
            decision: {
              sourceId: document.documentNumber,
              sourceName: document.source,
            },
            treatmentDuration: humanTreatment.treatment.duration,
            treatmentLastUpdateDate: new Date(
              humanTreatment.treatment.lastUpdateDate,
            ).toISOString(),
            userName: user.name,
          },
        });
      }
    }
  }

  logger.log({
    operationName: 'documentStatistics',
    msg: `Create statistics for document ${document.source}:${document.documentNumber}`,
    data: {
      decision: {
        sourceId: statistic.documentNumber,
        sourceName: statistic.source,
      },
      statistics: {
        route: statistic.route,
        wordsCount: statistic.wordsCount,
        surAnnotationsCount: statistic.surAnnotationsCount,
        subAnnotationsSensitiveCount: statistic.subAnnotationsSensitiveCount,
        subAnnotationsNonSensitiveCount:
          statistic.subAnnotationsNonSensitiveCount,
        linkedEntitiesCount: statistic.linkedEntitiesCount,
      },
    },
  });

  await statisticRepository.insert(statistic);
}
