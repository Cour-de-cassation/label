import { documentType } from '@label/core';
import { LabelTreatment } from 'dbsder-api-types';

export type { exporterConfigType };

type exporterConfigType = {
  name: string;
  sendDocumentPseudonymisationAndTreatments: (param: {
    externalId: documentType['externalId'];
    pseudoText: string;
    labelTreatments: LabelTreatment[];
  }) => Promise<void>;
};
