import { decisionModule, decisionType } from 'sder';
import { fileSystem } from '@label/backend';
import { sderApiType } from './sderApiType';

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

    return courtDecisions
      .map(({ content }) => {
        const parsedContent = JSON.parse(content) as decisionType;
        return {
          ...parsedContent,
          dateDecision: new Date(parsedContent.dateDecision),
        };
      })
      .map(decisionModule.lib.generateDecision);
  },

  async setCourtDecisionsLoaded() {},

  async setCourtDecisionDone() {},

  async updateDecisionPseudonymisation() {},
};
