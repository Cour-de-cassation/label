import { documentType } from '@label/core';
import { decisionType } from 'sder';

export type { connectorConfigType };

type connectorConfigType = {
  name: string;
  fetchPublicDecisionsBySourceAndJurisdictionsBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: string;
    jurisdictions: string[];
  }) => Promise<decisionType[]>;
  fetchCourtDecisionBySourceIdAndSourceName(params: {
    sourceId: number;
    sourceName: string;
  }): Promise<decisionType | undefined>;
  fetchAllCourtDecisionsBetween(params: {
    startDate: Date;
    endDate: Date;
  }): Promise<decisionType[]>;
  updateDocumentsLoadedStatus: (documents: documentType[]) => Promise<void>;
  updateDocumentsToBeTreatedStatus: (
    documents: documentType[],
  ) => Promise<void>;
  mapCourtDecisionToDocument: (courtDecision: decisionType) => documentType;
};
