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

  async fetchJurinetDecisionsToPseudonymiseBetween({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }) {
    const courtDecisions = await sderApi.fetchJurinetDecisionsToPseudonymiseBetween(
      {
        startDate,
        endDate,
      },
    );

    return courtDecisions;
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

    return courtDecisions;
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

    return courtDecisions;
  },
};
