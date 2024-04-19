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
    documentStatistics.map(async (val) => {
      const treatmentsDetails = await getUsersAndDuration(
        val.treatmentsSummary.map((treatment) => ({
          userId: treatment.userId,
          treatmentDuration: treatment.treatmentDuration,
        })),
        val._id,
      );

      return {
        ...val,
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
  const userIds = userTreatments.map((ut) => ut.userId);
  const val = await userService.fetchUsersByIds(userIds);
  return userTreatments.map((ut) => {
    const userIdString = idModule.lib.convertToString(ut.userId);
    const { email, name, _id } = val[userIdString];
    return {
      email: email,
      name: name,
      id: _id,
      statId: statId,
      treatmentDuration: ut.treatmentDuration,
    };
  });
}
