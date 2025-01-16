import { documentType } from '@label/core';
import { DecisionDTO, DecisionTJDTO, Sources } from 'dbsder-api-types';

export type { connectorConfigType };

type connectorConfigType = {
  name: string;
  fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: Sources;
    jurisdictions: string[];
    chambers: string[];
  }) => Promise<(DecisionDTO | DecisionTJDTO)[] | undefined>;
  fetchCourtDecisionBySourceIdAndSourceName(param: {
    sourceId: number;
    sourceName: string;
  }): Promise<DecisionDTO | DecisionTJDTO | undefined>;
  fetchChainedJuricaDecisionsToPseudonymiseBetween(param: {
    startDate: Date;
    endDate: Date;
  }): Promise<(DecisionDTO | DecisionTJDTO)[] | undefined>;
  fetchDecisionsToPseudonymiseBetween(param: {
    startDate: Date;
    endDate: Date;
    source: Sources;
  }): Promise<(DecisionDTO | DecisionTJDTO)[] | undefined>;
  fetchDecisionsToPseudonymiseBetweenDateCreation(param: {
    startDate: Date;
    endDate: Date;
    source: Sources;
  }): Promise<(DecisionDTO | DecisionTJDTO)[] | undefined>;
  updateDocumentsLoadedStatus: (param: {
    documents: documentType[];
  }) => Promise<void>;
  updateDocumentsToBeTreatedStatus: (param: {
    documents: documentType[];
  }) => Promise<void>;
  mapCourtDecisionToDocument: (
    courtDecision: DecisionDTO | DecisionTJDTO,
    importer: documentType['importer'],
  ) => Promise<documentType>;
  mapDocumentToCourtDecision: (
    document: documentType,
  ) => DecisionDTO | DecisionTJDTO;
};
