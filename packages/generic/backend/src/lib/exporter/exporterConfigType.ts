import { documentType } from '@label/core';
import { Deprecated } from '@label/core';

export type { exporterConfigType };

type exporterConfigType = {
  name: string;
  sendDocumentPseudonymisationAndTreatments: (param: {
    externalId: documentType['externalId'];
    pseudoText: string;
    labelTreatments: Deprecated.LabelTreatment[];
  }) => Promise<void>;
};
