import { decisionModule } from 'sder';
import { documentType } from '@label/core';
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
      decisionIds: documents.map(document => document.documentNumber),
      labelStatus: 'loaded',
    });
  },

  async setCourtDecisionDone(documentNumber) {
    await decisionModule.service.updateDecisionsLabelStatus({
      decisionIds: [documentNumber],
      labelStatus: 'done',
    });
  },

  async updateDecisionPseudonymisation({
    documentNumber,
    pseudonymizationText,
    labelTreatments,
  }) {
    await decisionModule.service.updateDecisionPseudonymisation({
      decisionId: documentNumber,
      decisionPseudonymisedText: pseudonymizationText,
      labelTreatments,
    });
  },
};
