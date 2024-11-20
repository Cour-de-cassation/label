import { documentType } from '@label/core';
import { DecisionDTO, Sources } from 'dbsder-api-types';

export type { connectorConfigType };

type connectorConfigType = {
  name: string;
  fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: Sources;
    jurisdictions: string[];
    chambers: string[];
  }) => Promise<DecisionDTO[] | undefined>;
  fetchCourtDecisionBySourceIdAndSourceName(param: {
    sourceId: number;
    sourceName: string;
  }): Promise<DecisionDTO | undefined>;
  fetchChainedJuricaDecisionsToPseudonymiseBetween(param: {
    startDate: Date;
    endDate: Date;
  }): Promise<DecisionDTO[] | undefined>;
  fetchDecisionsToPseudonymiseBetween(param: {
    startDate: Date;
    endDate: Date;
    source: Sources;
  }): Promise<DecisionDTO[] | undefined>;
  fetchDecisionsToPseudonymiseBetweenDateCreation(param: {
    startDate: Date;
    endDate: Date;
    source: Sources;
  }): Promise<DecisionDTO[] | undefined>;
  updateDocumentsLoadedStatus: (param: {
    documents: documentType[];
  }) => Promise<void>;
  updateDocumentsToBeTreatedStatus: (param: {
    documents: documentType[];
  }) => Promise<void>;
  mapCourtDecisionToDocument: (
    courtDecision: DecisionDTO,
    importer: documentType['importer'],
  ) => Promise<documentType>;
  mapDocumentToCourtDecision: (document: documentType) => DecisionDTO;
};
