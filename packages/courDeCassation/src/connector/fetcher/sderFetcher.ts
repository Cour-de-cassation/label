import { sderApi } from '../../sderApi';
import { sderMapper } from './mapper';

export { sderFetcher };

const sderFetcher = {
  async fetchAllDocuments() {
    const courtDecisions = await sderApi.fetchCourtDecisions();

    return courtDecisions.map(sderMapper.mapCourtDecisionToDocument);
  },
};
