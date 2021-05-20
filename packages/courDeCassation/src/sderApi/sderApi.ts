import { decisionModule } from 'sder';
import { documentType, idModule } from '@label/core';
import { sderApiType } from './sderApiType';

export { sderApi };

const sderApi: sderApiType = {
  async fetchCourtDecisionsBetween({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }) {
    const courtDecisions = await decisionModule.service.fetchJurinetAndChainedJuricaDecisionsToPseudonymiseBetween(
      { startDate, endDate },
    );

    return courtDecisions;
  },

  async fetchCourtDecisionsBySourceIdsAndSourceName(sourceIds, sourceName) {
    return decisionModule.service.fetchDecisionsBySourceIdsAndSourceName(
      sourceIds,
      sourceName,
    );
  },

  async setCourtDecisionsLoaded(documents: documentType[]) {
    await decisionModule.service.updateDecisionsLabelStatus({
      decisionIds: documents.map(document =>
        idModule.lib.buildId(document.externalId),
      ),
      labelStatus: 'loaded',
    });
  },

  async setCourtDecisionDone(externalId) {
    await decisionModule.service.updateDecisionsLabelStatus({
      decisionIds: [idModule.lib.buildId(externalId)],
      labelStatus: 'done',
    });
  },

  async updateDecisionPseudonymisation({
    externalId,
    pseudonymizationText,
    labelTreatments,
  }) {
    await decisionModule.service.updateDecisionPseudonymisation({
      decisionId: idModule.lib.buildId(externalId),
      decisionPseudonymisedText: pseudonymizationText,
      labelTreatments,
    });
  },
};
