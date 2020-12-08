import { buildMongo } from '@label/backend';
import { jurinetApiType } from './jurinetApiType';

export { jurinetApi };

const SDER_BDD_URL = 'http://bkpanonym';
const SDER_BDD_NAME = 'SDER';

const mongo = buildMongo({ dbName: SDER_BDD_NAME, url: SDER_BDD_URL });

const jurinetApi: jurinetApiType = {
  async fetchJurinetCourtDecisions() {
    await mongo.initialize();
    const collection = mongo.getDb().collection('decision');

    return collection.find().toArray();
  },
};
