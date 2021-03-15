import { sderApi } from '../../sderApi';
import { sderMapper } from './mapper';

export { sderFetcher };

const sderFetcher = {
  async fetchAllDocumentsSince(days: number) {
    const courtDecisions = await sderApi.fetchCourtDecisions(days);

    return courtDecisions.map(sderMapper.mapCourtDecisionToDocument);
  },
};
