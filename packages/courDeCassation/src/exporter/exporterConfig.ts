import { exporterConfigType } from '@label/backend';
import { sderApi } from '../sderApi';

export { exporterConfig };

const exporterConfig: exporterConfigType = {
  name: 'SDER',

  async sendDocumentPseudonymisationAndTreatments({
    externalId,
    pseudoText,
    labelTreatments,
  }) {
    await sderApi.updateDecisionPseudonymisation({
      externalId,
      pseudoText,
      labelTreatments,
    });
  },
};
