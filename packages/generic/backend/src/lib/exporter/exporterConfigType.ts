import { documentType } from '@label/core';

export type { exporterConfigType, labelTreatmentsType };

type exporterConfigType = {
  name: string;
  sendDocumentPseudonymisationAndTreatments: (param: {
    externalId: documentType['externalId'];
    pseudonymizationText: string;
    labelTreatments: labelTreatmentsType;
  }) => Promise<void>;
  sendDocumentBlockedStatus: (
    param: documentType['externalId'],
  ) => Promise<void>;
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
