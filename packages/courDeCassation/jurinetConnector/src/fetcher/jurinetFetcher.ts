import { jurinetApi } from './api';
import { jurinetMapper } from './mapper';

export { jurinetFetcher };

const jurinetFetcher = {
  async fetchAllDocuments() {
    const jurinetCourtDecisions = await jurinetApi.fetchJurinetCourtDecisions();

    return jurinetCourtDecisions.map(
      jurinetMapper.mapJurinetCourtDecisionToDocument,
    );
  },
};
