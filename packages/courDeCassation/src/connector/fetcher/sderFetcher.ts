import { sderApi } from '../../sderApi';

export { sderFetcher };

const sderFetcher = {
  async fetchCourtDecisionBySourceIdAndSourceName({
    sourceId,
    sourceName,
  }: {
    sourceId: number;
    sourceName: string;
  }) {
    return sderApi.fetchCourtDecisionBySourceIdAndSourceName({
      sourceId,
      sourceName,
    });
  },

  async fetchDecisionsToPseudonymiseBetween({
    startDate,
    endDate,
    source,
  }: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica' | 'juritj';
  }) {
    const courtDecisions = await sderApi.fetchDecisionsToPseudonymiseBetween({
      startDate,
      endDate,
      source,
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
  }: {
    startDate: Date;
    endDate: Date;
    source: 'jurinet' | 'jurica' | 'juritj';
  }) {
    const courtDecisions = await sderApi.fetchDecisionsToPseudonymiseBetweenDateCreation(
      {
        startDate,
        endDate,
        source,
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

    return courtDecisions?.filter(
      (courtDecision) => !!courtDecision && !!courtDecision.originalText,
    );
  },
};
