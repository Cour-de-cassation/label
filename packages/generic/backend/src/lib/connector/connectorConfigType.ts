import { documentType } from '@label/core';
import { decisionType } from 'sder';

export type { connectorConfigType };

type connectorConfigType = {
  name: string;
  fetchAllCourtDecisionsBetween(params: {
    startDate: Date;
    endDate: Date;
  }): Promise<decisionType[]>;
  fetchBoundDocumentsBySourceIds: (
    sourceIds: number[],
  ) => Promise<documentType[]>;
  updateDocumentsLoadedStatus: (documents: documentType[]) => Promise<void>;
  mapCourtDecisionToDocument: (courtDecision: decisionType) => documentType;
};
