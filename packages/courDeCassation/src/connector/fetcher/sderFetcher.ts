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

  async fetchAllDecisionsBySourceAndJurisdictionsBetween({
    startDate,
    endDate = new Date(),
    source,
    jurisdictions,
  }: {
    startDate: Date;
    endDate?: Date;
    source: string;
    jurisdictions: string[];
  }) {
    const courtDecisions = await sderApi.fetchAllDecisionsBySourceAndJurisdictionsBetween(
      {
        startDate,
        endDate,
        source,
        jurisdictions,
      },
    );

    return courtDecisions.filter(
      (courtDecision) => !!courtDecision && !!courtDecision.originalText,
    );
  },

  async fetchPublicDecisionsBySourceAndJurisdictionsBetween({
    startDate,
    endDate = new Date(),
    source,
    jurisdictions,
  }: {
    startDate: Date;
    endDate?: Date;
    source: string;
    jurisdictions: string[];
  }) {
    const courtDecisions = await sderApi.fetchPublicDecisionsBySourceAndJurisdictionsBetween(
      {
        startDate,
        endDate,
        source,
        jurisdictions,
      },
    );

    return courtDecisions.filter(
      (courtDecision) => !!courtDecision && !!courtDecision.originalText,
    );
  },
};
