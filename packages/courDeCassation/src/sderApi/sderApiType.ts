import { documentType } from '@label/core';
import { DecisionDTO, LabelTreatment, PublishStatus } from 'dbsder-api-types';

export type { sderApiType };

type sderApiType = {
  fetchChainedJuricaDecisionsToPseudonymiseBetween: (param: {
    startDate: Date;
    endDate: Date;
  }) => Promise<Array<DecisionDTO>>;
  fetchCourtDecisionById: (param: {
    id: DecisionDTO['_id'];
  }) => Promise<DecisionDTO>;
  fetchDecisionsToPseudonymiseBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica' | 'juritj';
  }) => Promise<Array<DecisionDTO>>;
  fetchDecisionsToPseudonymiseBetweenDateCreation: (param: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica' | 'juritj';
  }) => Promise<Array<DecisionDTO>>;
  fetchCourtDecisionBySourceIdAndSourceName: (param: {
    sourceId: DecisionDTO['sourceId'];
    sourceName: DecisionDTO['sourceName'];
  }) => Promise<DecisionDTO | undefined>;
  fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: string;
    jurisdictions: string[];
    chambers: string[];
  }) => Promise<DecisionDTO[]>;
  setCourtDecisionsLoaded: (param: {
    documents: Array<documentType>;
  }) => Promise<void>;
  setCourtDecisionsToBeTreated: (param: {
    documents: Array<documentType>;
  }) => Promise<void>;
  setCourtDecisionDone: (param: {
    externalId: documentType['externalId'];
  }) => Promise<void>;
  setCourtDecisionBlocked: (param: {
    externalId: documentType['externalId'];
  }) => Promise<void>;
  updateDecisionPseudonymisation: (param: {
    externalId: documentType['externalId'];
    pseudonymizationText: string;
    labelTreatments: LabelTreatment;
    publishStatus?: PublishStatus;
  }) => Promise<void>;
};
