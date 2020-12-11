import { buildMongo } from '@label/backend';
import { sderApiType } from './sderApiType';

export { sderApi };

const SDER_BDD_URL = 'http://bkpanonym';
const SDER_BDD_NAME = 'SDER';

const mongo = buildMongo({ dbName: SDER_BDD_NAME, url: SDER_BDD_URL });

const sderApi: sderApiType = {
  async fetchCourtDecisions() {
    await mongo.initialize();
    const collection = mongo.getDb().collection('decision');

    return collection.find().toArray();
  },
};
