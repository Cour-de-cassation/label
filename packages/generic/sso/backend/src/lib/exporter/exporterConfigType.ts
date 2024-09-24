import { documentType } from '@label/core';
import { publishStatusType, labelTreatmentsType } from 'sder';

export type { exporterConfigType };

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
