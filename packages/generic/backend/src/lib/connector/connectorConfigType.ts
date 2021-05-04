import { documentType } from '@label/core';
import { decisionType } from 'sder';

export type { connectorConfigType };

type connectorConfigType = {
  name: string;
  fetchAllCourtDecisionsSince(days: number): Promise<decisionType[]>;
  fetchBoundDocumentsBySourceIds: (
    sourceIds: number[],
  ) => Promise<documentType[]>;
  updateDocumentsLoadedStatus: (documents: documentType[]) => Promise<void>;
  mapCourtDecisionToDocument: (courtDecision: decisionType) => documentType;
};
