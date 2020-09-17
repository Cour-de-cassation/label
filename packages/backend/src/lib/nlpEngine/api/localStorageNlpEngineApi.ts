import { promises as fs } from 'fs';
import { nlpEngineApiType } from './nlpEngineApiType';

export { localStorageNlpEngineApi };

const pathToNlpEngineAnnotations = './tmp/storage/nlpEngine/jurinet/';

const localStorageNlpEngineApi: nlpEngineApiType = {
  async fetchNlpEngineAnnotations(courtDecision) {
    return JSON.parse(
      await fs.readFile(
        `${pathToNlpEngineAnnotations}${courtDecision.oracleId}.json`,
        {
          encoding: 'utf8',
        },
      ),
    );
  },
};
