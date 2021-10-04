import { sderApi } from '../../sderApi';

export { sderFetcher };

const MAX_DOCUMENT_SIZE = 500000;

const sderFetcher = {
  async fetchCourtDecisionBySourceIdAndSourceName({
    sourceId,
    sourceName,
  }: {
    sourceId: number;
    sourceName: string;
  }) {
    const courtDecisions = await sderApi.fetchCourtDecisionsBySourceIdsAndSourceName(
      [sourceId],
      sourceName,
    );

    if (courtDecisions.length === 0) {
      return undefined;
    }

    return courtDecisions[0];
  },

  async fetchAllCourtDecisionsBetween({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }) {
    const courtDecisions = await sderApi.fetchCourtDecisionsBetween({
      startDate,
      endDate,
    });

    return courtDecisions.filter(
      (courtDecision) =>
        courtDecision &&
        courtDecision.originalText &&
        courtDecision.originalText.length <= MAX_DOCUMENT_SIZE,
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
      (courtDecision) =>
        courtDecision &&
        courtDecision.originalText &&
        courtDecision.originalText.length <= MAX_DOCUMENT_SIZE,
    );
  },
};
