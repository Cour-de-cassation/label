import { promises as fs } from 'fs';
import { nlpApiType } from './nlpApiType';

export { buildFakeNlpApi };

function buildFakeNlpApi(): nlpApiType {
  const pathToLocalCourtDecisionAnnotations =
    './tmp/storage/nlpEngine/jurinet/';

  return {
    async fetchNlpEngineAnnotations(courtDecision) {
      return JSON.parse(
        await fs.readFile(
          `${pathToLocalCourtDecisionAnnotations}${courtDecision.oracleId}.json`,
          {
            encoding: 'utf8',
          },
        ),
      );
    },
  };
}
