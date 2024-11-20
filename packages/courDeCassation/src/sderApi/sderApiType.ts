import { documentType } from '@label/core';
import {
  DecisionDTO,
  DecisionTJDTO,
  LabelTreatment,
  PublishStatus,
  Sources,
} from 'dbsder-api-types';

export type { sderApiType };

type sderApiType = {
  fetchChainedJuricaDecisionsToPseudonymiseBetween: (param: {
    startDate: Date;
    endDate: Date;
  }) => Promise<Array<DecisionDTO | DecisionTJDTO>>;
  fetchCourtDecisionById: (param: {
    id: DecisionDTO['_id'] | DecisionTJDTO['_id'];
  }) => Promise<DecisionDTO | DecisionTJDTO>;
  fetchDecisionsToPseudonymiseBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: Sources;
  }) => Promise<Array<DecisionDTO | DecisionTJDTO>>;
  fetchDecisionsToPseudonymiseBetweenDateCreation: (param: {
    startDate: Date;
    endDate: Date;
    source: Sources;
  }) => Promise<Array<DecisionDTO | DecisionTJDTO>>;
  fetchCourtDecisionBySourceIdAndSourceName: (param: {
    sourceId: DecisionDTO['sourceId'] | DecisionTJDTO['sourceId'];
    sourceName: DecisionDTO['sourceName'] | DecisionTJDTO['sourceName'];
  }) => Promise<DecisionDTO | DecisionTJDTO | undefined>;
  fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: string;
    jurisdictions: string[];
    chambers: string[];
  }) => Promise<(DecisionDTO | DecisionTJDTO)[]>;
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
    labelTreatments: LabelTreatment[];
    publishStatus?: PublishStatus;
  }) => Promise<void>;
};
