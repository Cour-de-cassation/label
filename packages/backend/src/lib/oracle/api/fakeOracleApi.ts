import { fileSystem } from '../../../utils';
import { oracleApiType } from './oracleApiType';

export { fakeOracleApi };

const pathToJurinetCourtDecisions = './tmp/storage/oracle/jurinet/';

const fakeOracleApi: oracleApiType = {
  async fetchJurinetCourtDecisions() {
    const jurinetCourtDecisionFileNames = await fileSystem.listFilesOfDirectory(
      pathToJurinetCourtDecisions,
    );

    const jurinetCourtDecisions = await fileSystem.readFiles(
      jurinetCourtDecisionFileNames,
      'latin1',
      pathToJurinetCourtDecisions,
    );

    return jurinetCourtDecisions.map(({ fileName, content }) => ({
      date: new Date(),
      metadata: '',
      oracleId: fileName.slice(0, fileName.length - 4),
      source: 'jurinet',
      xmlCourtDecision: content,
    }));
  },
};
