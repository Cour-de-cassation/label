import { fileSystem } from '../../utils';
import { oracleType } from './oracleType';

export { buildFakeOracle };

function buildFakeOracle(): oracleType {
  const pathToJurinetLocalCourtDecisions = './tmp/storage/oracle/';

  return {
    async fetchJurinetCourtDecisions() {
      const jurinetCourtDecisionFileNames = await fileSystem.listFilesOfDirectory(
        pathToJurinetLocalCourtDecisions,
      );

      return fileSystem.readFiles(
        jurinetCourtDecisionFileNames,
        'latin1',
        pathToJurinetLocalCourtDecisions,
      );
    },
  };
}
