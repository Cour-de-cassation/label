import { documentType } from '@label/core';
import { decisionType } from 'sder';

export type { connectorConfigType };

type connectorConfigType = {
  name: string;
  fetchAllDecisionsBySourceAndJurisdictionsBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica';
    jurisdictions: string[];
  }) => Promise<decisionType[]>;
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
  fetchChainedJuricaDecisionsToPseudonymiseBetween(params: {
    startDate: Date;
    endDate: Date;
  }): Promise<decisionType[]>;
  fetchDecisionsToPseudonymiseBetween(params: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica';
  }): Promise<decisionType[]>;
  updateDocumentsLoadedStatus: (documents: documentType[]) => Promise<void>;
  updateDocumentsToBeTreatedStatus: (
    documents: documentType[],
  ) => Promise<void>;
  mapCourtDecisionToDocument: (courtDecision: decisionType) => documentType;
  mapDocumentToCourtDecision: (document: documentType) => decisionType;
};
