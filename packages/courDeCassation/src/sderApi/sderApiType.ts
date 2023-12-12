import { decisionType, publishStatusType } from 'sder';
import { documentType, environmentType } from '@label/core';
import { labelTreatmentsType } from '@label/backend';

export type { sderApiType };

type sderApiType = {
  fetchChainedJuricaDecisionsToPseudonymiseBetween: (param: {
    startDate: Date;
    endDate: Date;
    environment: environmentType;
  }) => Promise<Array<decisionType>>;
  fetchCourtDecisionById: (param: {
    id: decisionType['_id'];
    environment: environmentType;
  }) => Promise<decisionType>;
  fetchDecisionsToPseudonymiseBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica' | 'juritj';
    environment: environmentType;
  }) => Promise<Array<decisionType>>;
  fetchDecisionsToPseudonymiseBetweenDateCreation: (param: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica' | 'juritj';
    environment: environmentType;
  }) => Promise<Array<decisionType>>;
  fetchCourtDecisionBySourceIdAndSourceName: (param: {
    sourceId: decisionType['sourceId'];
    sourceName: decisionType['sourceName'];
    environment: environmentType;
  }) => Promise<decisionType | undefined>;
  fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: string;
    jurisdictions: string[];
    chambers: string[];
    environment: environmentType;
  }) => Promise<decisionType[]>;
  setCourtDecisionsLoaded: (param: {
    documents: Array<documentType>;
    environment: environmentType;
  }) => Promise<void>;
  setCourtDecisionsToBeTreated: (param: {
    documents: Array<documentType>;
    environment: environmentType;
  }) => Promise<void>;
  setCourtDecisionDone: (param: {
    externalId: documentType['externalId'];
    environment: environmentType;
  }) => Promise<void>;
  setCourtDecisionBlocked: (param: {
    externalId: documentType['externalId'];
    environment: environmentType;
  }) => Promise<void>;
  updateDecisionPseudonymisation: (param: {
    externalId: documentType['externalId'];
    pseudonymizationText: string;
    labelTreatments: labelTreatmentsType;
    publishStatus: publishStatusType;
    environment: environmentType;
  }) => Promise<void>;
};
