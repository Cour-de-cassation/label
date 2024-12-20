import { documentType } from '@label/core';
import { decisionType } from 'sder';

export type { connectorConfigType };

type connectorConfigType = {
  name: string;
  fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica' | 'juritj';
    jurisdictions: string[];
    chambers: string[];
  }) => Promise<decisionType[] | undefined>;
  fetchCourtDecisionBySourceIdAndSourceName(param: {
    sourceId: number;
    sourceName: string;
  }): Promise<decisionType | undefined>;
  fetchChainedJuricaDecisionsToPseudonymiseBetween(param: {
    startDate: Date;
    endDate: Date;
  }): Promise<decisionType[] | undefined>;
  fetchDecisionsToPseudonymiseBetween(param: {
    startDate: Date;
    endDate: Date;
    source: string;
  }): Promise<decisionType[] | undefined>;
  fetchDecisionsToPseudonymiseBetweenDateCreation(param: {
    startDate: Date;
    endDate: Date;
    source: string;
  }): Promise<decisionType[] | undefined>;
  updateDocumentsLoadedStatus: (param: {
    documents: documentType[];
  }) => Promise<void>;
  updateDocumentsToBeTreatedStatus: (param: {
    documents: documentType[];
  }) => Promise<void>;
  mapCourtDecisionToDocument: (
    courtDecision: decisionType,
    importer: documentType['importer'],
  ) => Promise<documentType>;
  mapDocumentToCourtDecision: (document: documentType) => decisionType;
};
