import { decisionModule } from 'sder';
import { documentType, idModule } from '@label/core';
import { dateBuilder } from '@label/backend';
import { sderApiType } from './sderApiType';

export { sderApi };

const sderApi: sderApiType = {
  async fetchCourtDecisions(days) {
    const dateDaysAgo = new Date(dateBuilder.daysAgo(days));
    const courtDecisions = await decisionModule.service.fetchDecisionsToPseudonymise(
      {
        date: dateDaysAgo,
      },
    );

    return courtDecisions;
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
