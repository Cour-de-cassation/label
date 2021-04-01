import { dependencyManager, documentType, httpRequester } from '@label/core';
import { dateBuilder } from '@label/backend';
import { sderApiType, sderCourtDecisionType } from './sderApiType';

export { sderApi };

const SDER_API_BASE_URL = dependencyManager.inject({
  forPreProd: 'http://127.0.0.1:54321',
  forProd: 'http://127.0.0.1:54321',
});

const sderApi: sderApiType = {
  async fetchCourtDecisions(days) {
    const dateDaysAgo = new Date(dateBuilder.daysAgo(days)).toISOString();
    const response = await httpRequester.get(
      `${SDER_API_BASE_URL}/decisions-to-pseudonymise?date="${dateDaysAgo}"`,
    );

    return response as sderCourtDecisionType[];
  },

  async setCourtDecisionsLoaded(documents: documentType[]) {
    await httpRequester.patch(`${SDER_API_BASE_URL}/update-label-status`, {
      decisionIds: documents.map(document => document.documentId),
      labelStatus: 'loaded',
    });
  },

  async setCourtDecisionDone(documentId) {
    await httpRequester.patch(`${SDER_API_BASE_URL}/update-label-status`, {
      decisionIds: [documentId],
      labelStatus: 'done',
    });
  },

  async updateDecisionPseudonymisation({
    documentId,
    pseudonymizationText,
    labelTreatments,
  }) {
    await httpRequester.patch(
      `${SDER_API_BASE_URL}/update-decision-pseudonymisation`,
      {
        decisionId: documentId,
        decisionPseudonymisedText: pseudonymizationText,
        labelTreatments,
      },
    );
  },
};
