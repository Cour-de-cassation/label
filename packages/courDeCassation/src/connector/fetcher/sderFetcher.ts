import { decisionType } from 'sder';
import { sderMapper } from '../mapper';
import { sderApi } from '../../sderApi';

export { sderFetcher };

const MAX_DOCUMENT_SIZE = 500000;

const sderFetcher = {
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
      courtDecision =>
        courtDecision &&
        courtDecision.originalText &&
        courtDecision.originalText.length <= MAX_DOCUMENT_SIZE,
    );
  },

  async fetchBoundDocumentsBySourceIds(sourceIds: decisionType['sourceId'][]) {
    const courtDecisions = await sderApi.fetchCourtDecisionsBySourceIdsAndSourceName(
      sourceIds,
      'jurica',
    );

    return courtDecisions.map(sderMapper.mapCourtDecisionToDocument);
  },
};
