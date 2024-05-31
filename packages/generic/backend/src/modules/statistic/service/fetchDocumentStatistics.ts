import { buildStatisticRepository } from '../repository';
import { idModule, statisticType } from '@label/core';
import { userService } from './../../../modules/user';
import { ObjectId } from 'mongodb';

export { fetchDocumentStatistics };

async function fetchDocumentStatistics(
  documentNumber: statisticType['documentNumber'],
) {
  const documentStatisticsRepository = buildStatisticRepository();
  const documentStatistics = await documentStatisticsRepository.findAllStatisticsByDocumentNumber(
    documentNumber,
  );

  const usersDocumentsStatistics = await Promise.all(
    documentStatistics.map(async (documentStatistic) => {
      const treatmentsDetails = await getUsersAndDuration(
        documentStatistic.treatmentsSummary.map((treatment) => ({
          userId: treatment.userId,
          treatmentDuration: treatment.treatmentDuration,
        })),
        documentStatistic._id,
      );

      return {
        ...documentStatistic,
        treatmentsSummary: treatmentsDetails,
      };
    }),
  );

  return usersDocumentsStatistics;
}

async function getUsersAndDuration(
  userTreatments: { userId: ObjectId; treatmentDuration: number }[],
  statId: ObjectId,
) {
  const userIds = userTreatments.map((userTreatment) => userTreatment.userId);
  const users = await userService.fetchUsersByIds(userIds);
  return userTreatments.map((userTreatment) => {
    const userIdString = idModule.lib.convertToString(userTreatment.userId);
    const { email, name, _id } = users[userIdString];
    return {
      email: email,
      name: name,
      id: _id,
      statId: statId,
      treatmentDuration: userTreatment.treatmentDuration,
    };
  });
}
