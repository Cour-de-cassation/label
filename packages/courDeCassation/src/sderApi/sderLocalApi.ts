import { decisionModule, decisionType } from 'sder';
import { fileSystem } from '@label/backend';
import { sderApiType } from './sderApiType';

export { sderLocalApi };

const pathToCourtDecisions = './storage/documents/';

const sderLocalApi: sderApiType = {
  async fetchCourtDecisionsBetween() {
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
          dateDecision: parsedContent.dateDecision,
        };
      })
      .map(decisionModule.lib.generateDecision);
  },

  async fetchCourtDecisionsBySourceIdsAndSourceName(sourceIds, sourceName) {
    const courtDecisionFileNames = await fileSystem.listFilesOfDirectory(
      pathToCourtDecisions,
    );

    const courtDecisions = await fileSystem.readFiles(
      courtDecisionFileNames,
      'utf8',
      pathToCourtDecisions,
    );

    const mappedCourtDecisions = courtDecisions.map(({ content }) => {
      const parsedContent = JSON.parse(content) as decisionType;
      return {
        ...parsedContent,
        dateDecision: parsedContent.dateDecision,
      };
    });

    return mappedCourtDecisions.filter(
      courtDecision =>
        sourceIds.includes(courtDecision.sourceId) &&
        courtDecision.sourceName === sourceName,
    );
  },

  async setCourtDecisionsLoaded() {},
  
  async setCourtDecisionsToBeTreated() {},

  async setCourtDecisionDone() {},

  async updateDecisionPseudonymisation() {},
};
