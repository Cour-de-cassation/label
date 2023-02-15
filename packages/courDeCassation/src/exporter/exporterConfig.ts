import { exporterConfigType } from '@label/backend';
import { idModule } from '@label/core';
import { sderApi } from '../sderApi';

export { exporterConfig };

const exporterConfig: exporterConfigType = {
  name: 'SDER',

  async sendDocumentPseudonymisationAndTreatments({
    externalId,
    pseudonymizationText,
    labelTreatments,
  }) {
    await sderApi.updateDecisionPseudonymisation({
      externalId,
      pseudonymizationText,
      labelTreatments,
    });

    await sderApi.setCourtDecisionDone(externalId);
  },

  async sendDocumentBlockedStatus(externalId) {
    const externalDecision = await sderApi.fetchCourtDecisionById(
      idModule.lib.buildId(externalId),
    );
    if (externalDecision.labelStatus == 'loaded') {
      await sderApi.setCourtDecisionBlocked(externalId);
    }
  },
};
