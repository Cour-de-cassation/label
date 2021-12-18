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

    return courtDecisions.filter(
      (courtDecision) => !!courtDecision && !!courtDecision.originalText,
    );
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
