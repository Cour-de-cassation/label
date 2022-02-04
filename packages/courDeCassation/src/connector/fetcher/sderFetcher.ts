import { sderApi } from '../../sderApi';
import { NON_PUBLIC_NAC_CODES } from './constants';

export { sderFetcher };

const sderFetcher = {
  async fetchCourtDecisionBySourceIdAndSourceName({
    sourceId,
    sourceName,
  }: {
    sourceId: number;
    sourceName: string;
  }) {
    return sderApi.fetchCourtDecisionBySourceIdAndSourceName(
      sourceId,
      sourceName,
    );
  },

  async fetchDecisionsToPseudonymiseBetween({
    startDate,
    endDate,
    source,
  }: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica';
  }) {
    const courtDecisions = await sderApi.fetchDecisionsToPseudonymiseBetween({
      startDate,
      endDate,
      source,
    });

    return courtDecisions.filter((courtDecision) => {
      if (!courtDecision.originalText) {
        return false;
      }
      if (
        courtDecision.sourceName === 'jurica' &&
        !!courtDecision.NACCode &&
        NON_PUBLIC_NAC_CODES.includes(courtDecision.NACCode)
      ) {
        return false;
      }
      return true;
    });
  },

  async fetchChainedJuricaDecisionsToPseudonymiseBetween({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }) {
    const courtDecisions = await sderApi.fetchChainedJuricaDecisionsToPseudonymiseBetween(
      {
        startDate,
        endDate,
      },
    );

    return courtDecisions.filter(
      (courtDecision) => !!courtDecision && !!courtDecision.originalText,
    );
  },

  async fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween({
    startDate,
    endDate = new Date(),
    source,
    jurisdictions,
    chambers,
  }: {
    startDate: Date;
    endDate?: Date;
    source: string;
    jurisdictions: string[];
    chambers: string[];
  }) {
    const courtDecisions = await sderApi.fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween(
      {
        startDate,
        endDate,
        source,
        jurisdictions,
        chambers,
      },
    );

    return courtDecisions.filter(
      (courtDecision) => !!courtDecision && !!courtDecision.originalText,
    );
  },

  async fetchPublicDecisionsBySourceAndJurisdictionsAndChambersBetween({
    startDate,
    endDate = new Date(),
    source,
    jurisdictions,
    chambers,
  }: {
    startDate: Date;
    endDate?: Date;
    source: string;
    jurisdictions: string[];
    chambers: string[];
  }) {
    const courtDecisions = await sderApi.fetchPublicDecisionsBySourceAndJurisdictionsAndChambersBetween(
      {
        startDate,
        endDate,
        source,
        jurisdictions,
        chambers,
      },
    );

    return courtDecisions.filter(
      (courtDecision) => !!courtDecision && !!courtDecision.originalText,
    );
  },
};
