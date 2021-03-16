import { sderApi } from '../../sderApi';
import { sderMapper } from './mapper';

export { sderFetcher };

const MAX_DOCUMENT_SIZE = 500000;

const sderFetcher = {
  async fetchAllDocumentsSince(days: number) {
    const courtDecisions = await sderApi.fetchCourtDecisions(days);

    return courtDecisions
      .map(sderMapper.mapCourtDecisionToDocument)
      .filter(document => document.text.length <= MAX_DOCUMENT_SIZE);
  },
};
