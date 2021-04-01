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
      decisionIds: documents.map(document => document.documentId.toString()),
      labelStatus: 'loaded',
    });
  },

  async setCourtDecisionDone(documentId) {
    await decisionModule.service.updateDecisionsLabelStatus({
      decisionIds: [documentId.toString()],
      labelStatus: 'done',
    });
  },

  async updateDecisionPseudonymisation({
    documentId,
    pseudonymizationText,
    labelTreatments,
  }) {
    await decisionModule.service.updateDecisionPseudonymisation({
      decisionId: documentId.toString(),
      decisionPseudonymisedText: pseudonymizationText,
      labelTreatments,
    });
  },
};
