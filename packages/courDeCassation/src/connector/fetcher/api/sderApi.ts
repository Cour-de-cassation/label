import { MongoClient } from 'mongodb';
import { dependencyManager } from '@label/core';
import { sderApiType } from './sderApiType';

export { sderApi };

const SDER_BDD_URL = dependencyManager.inject({
  forPreProd: 'mongodb://bkpanonym:27017',
  forProd: 'mongodb://srpanonym:27017',
});
const SDER_BDD_NAME = 'SDER';

const sderApi: sderApiType = {
  async fetchCourtDecisions() {
    const mongo = await new MongoClient(SDER_BDD_URL, {
      useUnifiedTopology: true,
    }).connect();

    const collection = mongo.db(SDER_BDD_NAME).collection('decisions');

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
