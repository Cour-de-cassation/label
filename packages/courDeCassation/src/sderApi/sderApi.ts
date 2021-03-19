import axios from 'axios';
import http from 'http';
import { dependencyManager, documentType } from '@label/core';
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
    const response = await axios({
      headers: { 'Content-Type': 'application/json' },
      httpAgent: new http.Agent({ keepAlive: true }),
      method: 'get',
      url: `${SDER_API_BASE_URL}/decisions-to-pseudonymise?date="${dateDaysAgo}"`,
    });

    return response.data as sderCourtDecisionType[];
  },

  async setCourtDecisionsLoaded(documents: documentType[]) {
    await axios({
      data: {
        decisionIds: documents.map(document => document.documentId),
        labelStatus: 'loaded',
      },
      headers: { 'Content-Type': 'application/json' },
      method: 'patch',
      url: `${SDER_API_BASE_URL}/update-label-status`,
    });
  },

  async setCourtDecisionDone(documentId) {
    await axios({
      data: {
        decisionIds: [documentId],
        labelStatus: 'done',
      },
      headers: { 'Content-Type': 'application/json' },
      method: 'patch',
      url: `${SDER_API_BASE_URL}/update-label-status`,
    });
  },

  async updateDecisionPseudonymisation({
    documentId,
    pseudonymizationText,
    labelTreatments,
  }) {
    await axios({
      data: {
        decisionId: documentId,
        decisionPseudonymisedText: pseudonymizationText,
        labelTreatments,
      },
      headers: { 'Content-Type': 'application/json' },
      method: 'patch',
      url: `${SDER_API_BASE_URL}/update-decision-pseudonymisation`,
    });
  },
};
