import { fileSystem } from '@label/backend';
import { sderApiType, sderCourtDecisionType } from './sderApiType';

export { sderLocalApi };

const pathToCourtDecisions = './storage/documents/';

const sderLocalApi: sderApiType = {
  async fetchCourtDecisions() {
    const courtDecisionFileNames = await fileSystem.listFilesOfDirectory(
      pathToCourtDecisions,
    );

    const courtDecisions = await fileSystem.readFiles(
      courtDecisionFileNames,
      'utf8',
      pathToCourtDecisions,
    );

    return courtDecisions.map(
      ({ content }) => JSON.parse(content) as sderCourtDecisionType,
    );
  },

  async setCourtDecisionsLoaded() {},

  async setCourtDecisionDone() {},

  async updateDecisionPseudonymisation() {},
};
