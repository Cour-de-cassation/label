import { exporterConfigType } from '@label/backend';
import { sderApi } from '../sderApi';

export { exporterConfig };

const exporterConfig: exporterConfigType = {
  name: 'SDER',

  async sendDocumentPseudonymisationAndTreatments({
    documentNumber,
    pseudonymizationText,
    labelTreatments,
  }) {
    await sderApi.updateDecisionPseudonymisation({
      documentNumber,
      pseudonymizationText,
      labelTreatments,
    });

    await sderApi.setCourtDecisionDone(documentNumber);
  },
};
