import { documentType, environmentType } from '@label/core';

export type { exporterConfigType, labelTreatmentsType };

type exporterConfigType = {
  name: string;
  sendDocumentPseudonymisationAndTreatments: (param: {
    externalId: documentType['externalId'];
    pseudonymizationText: string;
    labelTreatments: labelTreatmentsType;
    environment: environmentType;
  }) => Promise<void>;
  sendDocumentBlockedStatus: (param: {
    externalId: documentType['externalId'];
    environment: environmentType;
  }) => Promise<void>;
};

type labelTreatmentsType = Array<{
  annotations: Array<{
    category: string;
    entityId: string;
    start: number;
    text: string;
  }>;
  source: string;
  order: number;
}>;
