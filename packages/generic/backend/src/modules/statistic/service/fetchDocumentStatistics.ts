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

  const userIdString: ObjectId[] = [];
  documentStatistics.map(({ treatmentsSummary }) => {
    return treatmentsSummary.map((value) => {
      if (value.userId != null) {
        userIdString.push(value.userId);
      }
    });
  });

  const result = await getStatisticsAndUsers(userIdString);

  const getFinalStatistics = documentStatistics.map((stat) => {
    const user = stat.treatmentsSummary.map((treatment) => {
      return result.map((value) => {
        if (value.id == idModule.lib.convertToString(treatment.userId)) {
          return { ...value, treatmentDuration: treatment.treatmentDuration };
        } else {
          return null;
        }
      });
    });

    return {
      ...stat,
      treatmentsSummary: user[0],
    };
  });

  return getFinalStatistics;
}
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const getStatisticsAndUsers = async (userIds: ObjectId[]) => {
  const reponse = await userService.fetchUsersByIds(userIds).then((val) => {
    return userIds.map((vall) => {
      const userIdString = idModule.lib.convertToString(vall);
      const { email, name, _id } = val[userIdString] as any;
      return { email: email, name: name, id: _id };
    });
  });
  return reponse;
};
