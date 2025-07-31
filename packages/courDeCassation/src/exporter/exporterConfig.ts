import { exporterConfigType } from '@label/backend';
import { sderApi } from '../sderApi';

export { exporterConfig };

const exporterConfig: exporterConfigType = {
  name: 'SDER',

  async updateDecisionPseudonymisation({
    externalId,
    pseudoText,
    labelTreatments,
    labelStatus,
    publishStatus,
  }) {
    await sderApi.updateDecisionPseudonymisation({
      externalId,
      pseudoText,
      labelTreatments,
      labelStatus,
      publishStatus,
    });
  },
  async fetchDecisionByExternalId(externalId) {
    const decision = await sderApi.fetchDecisionByExternalId(externalId);
    return decision;
  },
};
