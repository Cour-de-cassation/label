import { decisionType } from 'sder';
import { sderMapper } from '../mapper';
import { sderApi } from '../../sderApi';

export { sderFetcher };

const MAX_DOCUMENT_SIZE = 500000;

const sderFetcher = {
  async fetchAllCourtDecisionsSince(days: number) {
    const courtDecisions = await sderApi.fetchCourtDecisions(days);

    return courtDecisions
      .filter(
        (courtDecision) =>
          courtDecision && courtDecision.originalText.length <= MAX_DOCUMENT_SIZE,
      );
  },

  async fetchBoundDocumentsBySourceIds(sourceIds: decisionType['sourceId'][]) {
    const courtDecisions = await sderApi.fetchCourtDecisionsBySourceIdsAndSourceName(sourceIds, 'jurica');

    return courtDecisions.map(sderMapper.mapCourtDecisionToDocument)
  },
};
