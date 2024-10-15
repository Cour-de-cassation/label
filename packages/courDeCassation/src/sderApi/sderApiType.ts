import {documentType} from '@label/core';
import {DecisionTJDTO, LabelTreatment, PublishStatus} from "dbsder-api-types";

export type {sderApiType};

type sderApiType = {
    fetchChainedJuricaDecisionsToPseudonymiseBetween: (param: {
        startDate: Date;
        endDate: Date;
    }) => Promise<Array<DecisionTJDTO>>;
    fetchCourtDecisionById: (param: {
        id: DecisionTJDTO['_id'];
    }) => Promise<DecisionTJDTO>;
    fetchDecisionsToPseudonymiseBetween: (param: {
        startDate: Date;
        endDate: Date;
        source: 'jurinet' | 'jurica' | 'juritj';
    }) => Promise<Array<DecisionTJDTO>>;
    fetchDecisionsToPseudonymiseBetweenDateCreation: (param: {
        startDate: Date;
        endDate: Date;
        source: 'jurinet' | 'jurica' | 'juritj';
    }) => Promise<Array<DecisionTJDTO>>;
    fetchCourtDecisionBySourceIdAndSourceName: (param: {
        sourceId: DecisionTJDTO['sourceId'];
        sourceName: DecisionTJDTO['sourceName'];
    }) => Promise<DecisionTJDTO | undefined>;
    fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween: (param: {
        startDate: Date;
        endDate: Date;
        source: string;
        jurisdictions: string[];
        chambers: string[];
    }) => Promise<DecisionTJDTO[]>;
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
