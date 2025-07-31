import { documentType } from '@label/core';
import { Deprecated } from '@label/core';

export type { exporterConfigType };

type exporterConfigType = {
  name: string;
  updateDecisionPseudonymisation: (param: {
    externalId: documentType['externalId'];
    pseudoText: string;
    labelTreatments: Deprecated.LabelTreatment[];
    labelStatus: Deprecated.LabelStatus;
    publishStatus: Deprecated.PublishStatus;
  }) => Promise<void>;
  fetchDecisionByExternalId: (
    externalId: documentType['externalId'],
  ) => Promise<Deprecated.DecisionDTO | undefined>;
};
