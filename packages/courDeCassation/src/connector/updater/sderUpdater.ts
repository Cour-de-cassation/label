import { sderApi } from '../../sderApi';

export { sderUpdater };

const sderUpdater = {
  async updateDocumentLabelStatusToLoaded(externalId: string) {
    await sderApi.setCourtDecisionLoaded(externalId);
  },
};
