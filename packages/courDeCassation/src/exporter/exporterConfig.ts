import { exporterConfigType } from '@label/backend';
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

  async sendDocumentLockedStatus({ externalId }) {
    await sderApi.setCourtDecisionLocked(externalId);
  },
};
