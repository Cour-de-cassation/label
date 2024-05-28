import { exporterConfigType } from '@label/backend';
import { documentType, idModule } from '@label/core';
import { sderApi } from '../sderApi';

export { exporterConfig };

const exporterConfig: exporterConfigType = {
  name: 'SDER',

  async sendDocumentPseudonymisationAndTreatments({
    externalId,
    pseudonymizationText,
    labelTreatments,
    publishStatus,
  }) {
    await sderApi.updateDecisionPseudonymisation({
      externalId,
      pseudonymizationText,
      labelTreatments,
      publishStatus,
    });

    await sderApi.setCourtDecisionDone({ externalId });
  },

  async sendDocumentBlockedStatus({
    externalId,
  }: {
    externalId: documentType['externalId'];
  }) {
    const externalDecision = await sderApi.fetchCourtDecisionById({
      id: idModule.lib.buildId(externalId),
    });
    if (externalDecision.labelStatus == 'loaded') {
      await sderApi.setCourtDecisionBlocked({ externalId });
    }
  },
};
