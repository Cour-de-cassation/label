import { documentType } from '@label/core';
import { decisionType } from 'sder';

export type { connectorConfigType };

type connectorConfigType = {
  name: string;
  fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica';
    jurisdictions: string[];
    chambers: string[];
  }) => Promise<decisionType[]>;
  fetchPublicDecisionsBySourceAndJurisdictionsAndChambersBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: string;
    jurisdictions: string[];
    chambers: string[];
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
  mapCourtDecisionToDocument: (
    courtDecision: decisionType,
  ) => Promise<documentType>;
  mapDocumentToCourtDecision: (document: documentType) => decisionType;
};
