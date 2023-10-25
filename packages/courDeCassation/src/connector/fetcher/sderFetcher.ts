import { environmentType } from '@label/core';
import { sderApi } from '../../sderApi';

export { sderFetcher };

const sderFetcher = {
  async fetchCourtDecisionBySourceIdAndSourceName({
    sourceId,
    sourceName,
    environment,
  }: {
    sourceId: number;
    sourceName: string;
    environment: environmentType;
  }) {
    return sderApi.fetchCourtDecisionBySourceIdAndSourceName({
      sourceId,
      sourceName,
      environment,
    });
  },

  async fetchDecisionsToPseudonymiseBetween({
    startDate,
    endDate,
    source,
    environment,
  }: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica' | 'juritj';
    environment: environmentType;
  }) {
    const courtDecisions = await sderApi.fetchDecisionsToPseudonymiseBetween({
      startDate,
      endDate,
      source,
      environment,
    });

    return courtDecisions?.filter((courtDecision) => {
      if (!courtDecision.originalText) {
        return false;
      }
      return true;
    });
  },

  async fetchDecisionsToPseudonymiseBetweenDateCreation({
    startDate,
    endDate,
    source,
    environment,
  }: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica' | 'juritj';
    environment: environmentType;
  }) {
    const courtDecisions = await sderApi.fetchDecisionsToPseudonymiseBetweenDateCreation(
      {
        startDate,
        endDate,
        source,
        environment,
      },
    );

    return courtDecisions?.filter((courtDecision) => {
      if (!courtDecision.originalText) {
        return false;
      }
      return true;
    });
  },

  async fetchChainedJuricaDecisionsToPseudonymiseBetween({
    startDate,
    endDate,
    environment,
  }: {
    startDate: Date;
    endDate: Date;
    environment: environmentType;
  }) {
    const courtDecisions = await sderApi.fetchChainedJuricaDecisionsToPseudonymiseBetween(
      {
        startDate,
        endDate,
        environment,
      },
    );

    return courtDecisions?.filter(
      (courtDecision) => !!courtDecision && !!courtDecision.originalText,
    );
  },

  async fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween({
    startDate,
    endDate = new Date(),
    source,
    jurisdictions,
    chambers,
    environment,
  }: {
    startDate: Date;
    endDate?: Date;
    source: string;
    jurisdictions: string[];
    chambers: string[];
    environment: environmentType;
  }) {
    const courtDecisions = await sderApi.fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween(
      {
        startDate,
        endDate,
        source,
        jurisdictions,
        chambers,
        environment,
      },
    );

    return courtDecisions?.filter(
      (courtDecision) => !!courtDecision && !!courtDecision.originalText,
    );
  },
};
