import { documentType, environmentType } from '@label/core';
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
    environment: environmentType;
  }) => Promise<decisionType[] | undefined>;
  fetchCourtDecisionBySourceIdAndSourceName(param: {
    sourceId: number;
    sourceName: string;
    environment: environmentType;
  }): Promise<decisionType | undefined>;
  fetchChainedJuricaDecisionsToPseudonymiseBetween(param: {
    startDate: Date;
    endDate: Date;
    environment: environmentType;
  }): Promise<decisionType[] | undefined>;
  fetchDecisionsToPseudonymiseBetween(param: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica' | 'juritj';
    environment: environmentType;
  }): Promise<decisionType[] | undefined>;
  fetchDecisionsToPseudonymiseBetweenDateCreation(param: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica' | 'juritj';
    environment: environmentType;
  }): Promise<decisionType[] | undefined>;
  updateDocumentsLoadedStatus: (param: {
    documents: documentType[];
    environment: environmentType;
  }) => Promise<void>;
  updateDocumentsToBeTreatedStatus: (param: {
    documents: documentType[];
    environment: environmentType;
  }) => Promise<void>;
  mapCourtDecisionToDocument: (
    courtDecision: decisionType,
    importer: documentType['importer'],
  ) => Promise<documentType>;
  mapDocumentToCourtDecision: (document: documentType) => decisionType;
};
