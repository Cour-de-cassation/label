import { buildStatisticRepository } from '../repository';
import { logger } from '../../../utils';
import { idModule, statisticType } from '@label/core';
import { userService } from './../../../modules/user';
import { ObjectId } from 'mongodb';
// import { values } from 'lodash';

export { fetchDocumentStatistics };

async function fetchDocumentStatistics(documentNumber: statisticType['documentNumber']) {
  const documentStatisticsRepository = buildStatisticRepository();
  const documentStatistics = await documentStatisticsRepository.findAllStatisticsByDocumentNumber(documentNumber)
  logger.log({ operationName: "fetchDocumentStatistics", msg: `the documentStatistics : ${documentStatistics}` })

  let userIdString: ObjectId[] = [];

  // partinnoer les partis, 
  documentStatistics.map(({ treatmentsSummary }) => {
    return treatmentsSummary.map((val) => {
      if (val.userId != null) {
        userIdString.push(val.userId)
      }
    })
  });

  const result = await getStatisticsAndUsers(userIdString);
  console.log('get all users', result)

  const getFinalStatistics = documentStatistics.map((val) => {
    const p = result.map((value) => {
      console.log("in result map", value)
      return val.treatmentsSummary.map((val) => {
        console.log("in treatmentsSummary map", val)
        if (value.id == idModule.lib.convertToString(val.userId)) {
          return { ...value, "treatmentDuration": val.treatmentDuration };
        } else {

        };
      })
    });

    console.log('ppp======> ', p)

    return {
      ...val,
      "treatmentsSummary": p[0],
    }
  })
  console.log('theGoodDoc', getFinalStatistics)

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
