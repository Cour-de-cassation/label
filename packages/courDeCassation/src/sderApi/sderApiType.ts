import { decisionType } from 'sder';
import { documentType } from '@label/core';
import { labelTreatmentsType } from '@label/backend';

export type { sderApiType };

type sderApiType = {
  fetchCourtDecisionsBetween: (params: {
    startDate: Date;
    endDate: Date;
  }) => Promise<Array<decisionType>>;
  fetchCourtDecisionsBySourceIdsAndSourceName: (sourceIds: decisionType['sourceId'][], sourceName: decisionType['sourceName']) => Promise<decisionType[]>;
setCourtDecisionsLoaded: (documents: Array<documentType>) => Promise<void>;
  setCourtDecisionDone: (
    externalId: documentType['externalId'],
  ) => Promise<void>;
  updateDecisionPseudonymisation: (param: {
    externalId: documentType['externalId'];
    pseudonymizationText: string;
    labelTreatments: labelTreatmentsType;
  }) => Promise<void>;
};
