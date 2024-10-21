import { documentType } from '@label/core';
import { LabelTreatment, PublishStatus } from 'dbsder-api-types';

export type { exporterConfigType };

type exporterConfigType = {
  name: string;
  sendDocumentPseudonymisationAndTreatments: (param: {
    externalId: documentType['externalId'];
    pseudonymizationText: string;
    labelTreatments: LabelTreatment;
    publishStatus?: PublishStatus;
  }) => Promise<void>;
  sendDocumentBlockedStatus: (param: {
    externalId: documentType['externalId'];
  }) => Promise<void>;
};
