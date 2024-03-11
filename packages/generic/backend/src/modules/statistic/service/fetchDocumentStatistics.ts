import { buildStatisticRepository } from '../repository';
import { idModule, statisticType } from '@label/core';
import { userService } from './../../../modules/user';
import { ObjectId } from 'mongodb';

export { fetchDocumentStatistics };

async function fetchDocumentStatistics(documentNumber: statisticType['documentNumber']) {
  const documentStatisticsRepository = buildStatisticRepository();
  const documentStatistics = await documentStatisticsRepository.findAllStatisticsByDocumentNumber(documentNumber)

  let userIdString: ObjectId[] = [];
  documentStatistics.map(({ treatmentsSummary }) => {
    return treatmentsSummary.map((val) => {
      if (val.userId != null) {
        userIdString.push(val.userId)
      }
    })
  });

  const result = await getStatisticsAndUsers(userIdString);

  const getFinalStatistics = documentStatistics.map((val) => {
    const p = val.treatmentsSummary.map((val) => {
      return result.map((value) => {
        if (value.id == idModule.lib.convertToString(val.userId)) {
          return { ...value, "treatmentDuration": val.treatmentDuration };
        } else {
          return null;
        }
      });

    })

    return {
      ...val,
      "treatmentsSummary": p[0],
    }
  })

  return getFinalStatistics;
}

const getStatisticsAndUsers = async (userIds: ObjectId[]) => {
  const reponse = await userService.fetchUsersByIds(userIds).then((val) => {
    return userIds.map((vall) => {
      const userIdString = idModule.lib.convertToString(vall) as any;
      const { email, name, _id } = val[userIdString] as any;
      return { email: email, name: name, id: _id }
    })
  });
  return reponse;
}
