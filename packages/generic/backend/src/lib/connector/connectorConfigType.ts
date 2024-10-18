import { documentType } from '@label/core';
import { DecisionTJDTO, Sources } from 'dbsder-api-types';

export type { connectorConfigType };

type connectorConfigType = {
  name: string;
  fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: Sources;
    jurisdictions: string[];
    chambers: string[];
  }) => Promise<DecisionTJDTO[] | undefined>;
  fetchCourtDecisionBySourceIdAndSourceName(param: {
    sourceId: number;
    sourceName: string;
  }): Promise<DecisionTJDTO | undefined>;
  fetchChainedJuricaDecisionsToPseudonymiseBetween(param: {
    startDate: Date;
    endDate: Date;
  }): Promise<DecisionTJDTO[] | undefined>;
  fetchDecisionsToPseudonymiseBetween(param: {
    startDate: Date;
    endDate: Date;
    source: Sources;
  }): Promise<DecisionTJDTO[] | undefined>;
  fetchDecisionsToPseudonymiseBetweenDateCreation(param: {
    startDate: Date;
    endDate: Date;
    source: Sources;
  }): Promise<DecisionTJDTO[] | undefined>;
  updateDocumentsLoadedStatus: (param: {
    documents: documentType[];
  }) => Promise<void>;
  updateDocumentsToBeTreatedStatus: (param: {
    documents: documentType[];
  }) => Promise<void>;
  mapCourtDecisionToDocument: (
    courtDecision: DecisionTJDTO,
    importer: documentType['importer'],
  ) => Promise<documentType>;
  mapDocumentToCourtDecision: (document: documentType) => DecisionTJDTO;
};
