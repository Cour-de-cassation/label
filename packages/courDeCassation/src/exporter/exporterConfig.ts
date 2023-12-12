import { exporterConfigType } from '@label/backend';
import { documentType, environmentType, idModule } from '@label/core';
import { sderApi } from '../sderApi';

export { exporterConfig };

const exporterConfig: exporterConfigType = {
  name: 'SDER',

  async sendDocumentPseudonymisationAndTreatments({
    externalId,
    pseudonymizationText,
    labelTreatments,
    publishStatus,
    environment,
  }) {
    await sderApi.updateDecisionPseudonymisation({
      externalId,
      pseudonymizationText,
      labelTreatments,
      publishStatus,
      environment,
    });

    await sderApi.setCourtDecisionDone({ externalId, environment });
  },

  async sendDocumentBlockedStatus({
    externalId,
    environment,
  }: {
    externalId: documentType['externalId'];
    environment: environmentType;
  }) {
    const externalDecision = await sderApi.fetchCourtDecisionById({
      id: idModule.lib.buildId(externalId),
      environment,
    });
    if (externalDecision.labelStatus == 'loaded') {
      await sderApi.setCourtDecisionBlocked({ externalId, environment });
    }
  },
};
