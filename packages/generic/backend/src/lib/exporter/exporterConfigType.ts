import { documentType } from '@label/core';
import { publishStatusType } from 'sder';

export type { exporterConfigType, labelTreatmentsType };

type exporterConfigType = {
  name: string;
  sendDocumentPseudonymisationAndTreatments: (param: {
    externalId: documentType['externalId'];
    pseudonymizationText: string;
    labelTreatments: labelTreatmentsType;
    publishStatus?: publishStatusType;
  }) => Promise<void>;
  sendDocumentBlockedStatus: (param: {
    externalId: documentType['externalId'];
  }) => Promise<void>;
};

type labelTreatmentsType = Array<{
  annotations: Array<{
    category: string;
    entityId: string;
    start: number;
    text: string;
  }>;
  version?: documentType['nlpVersions'];
  source: string;
  order: number;
}>;
