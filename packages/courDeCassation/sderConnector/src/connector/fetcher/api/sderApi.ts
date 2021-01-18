import { dependencyManager } from '@label/core';
import { buildMongo } from '@label/backend';
import { sderApiType } from './sderApiType';

export { sderApi };

const SDER_BDD_URL = dependencyManager.inject({
  forPreProd: 'http://bkpanonym:27017',
  forProd: 'http://srpanonym:27017',
});
const SDER_BDD_NAME = 'SDER';

const mongo = buildMongo({ dbName: SDER_BDD_NAME, url: SDER_BDD_URL });

const sderApi: sderApiType = {
  async fetchCourtDecisions() {
    await mongo.initialize();
    const collection = mongo.getDb().collection('decision');

    return collection
      .find({
        dateCreation: { $gte: computeOneMonthAgoDate() },
      })
      .toArray();
  },
};

function computeOneMonthAgoDate() {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return oneMonthAgo.toISOString();
}
