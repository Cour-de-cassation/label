import { decisionType, publishStatusType } from 'sder';
import { documentType } from '@label/core';
import { labelTreatmentsType } from 'sder';

export type { sderApiType };

type sderApiType = {
  fetchChainedJuricaDecisionsToPseudonymiseBetween: (param: {
    startDate: Date;
    endDate: Date;
  }) => Promise<Array<decisionType>>;
  fetchCourtDecisionById: (param: {
    id: decisionType['_id'];
  }) => Promise<decisionType>;
  fetchDecisionsToPseudonymiseBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica' | 'juritj';
  }) => Promise<Array<decisionType>>;
  fetchDecisionsToPseudonymiseBetweenDateCreation: (param: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica' | 'juritj';
  }) => Promise<Array<decisionType>>;
  fetchCourtDecisionBySourceIdAndSourceName: (param: {
    sourceId: decisionType['sourceId'];
    sourceName: decisionType['sourceName'];
  }) => Promise<decisionType | undefined>;
  fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: string;
    jurisdictions: string[];
    chambers: string[];
  }) => Promise<decisionType[]>;
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
    labelTreatments: labelTreatmentsType;
    publishStatus?: publishStatusType;
  }) => Promise<void>;
};
