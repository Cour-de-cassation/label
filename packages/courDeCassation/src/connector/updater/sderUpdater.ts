import { documentType } from '@label/core';
import { sderApi } from '../../sderApi';

export { sderUpdater };

const sderUpdater = {
  async updateDocumentsToBeTreatedStatus(documents: documentType[] ) {
    await sderApi.setCourtDecisionsToBeTreated(documents);
  },
  async updateDocumentsLoadedStatus(documents: documentType[]) {
    await sderApi.setCourtDecisionsLoaded(documents);
  },
};
