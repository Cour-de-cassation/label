import { exporterConfigType } from '@label/backend';
import { sderApi } from '../sderApi';

export { exporterConfig };

const exporterConfig: exporterConfigType = {
  name: 'SDER',

  async sendDocumentPseudonymisationAndTreatments({
    documentId,
    pseudonymizationText,
    labelTreatments,
  }) {
    await sderApi.updateDecisionPseudonymisation({
      documentId,
      pseudonymizationText,
      labelTreatments,
    });

    await sderApi.setCourtDecisionDone(documentId);
  },
};
