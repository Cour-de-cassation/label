import { documentType } from '@label/core';
import { sderApi } from '../../sderApi';

export { sderUpdater };

const sderUpdater = {
  async updateDocumentsLoadedStatus(documents: documentType[]) {
    await sderApi.setCourtDecisionsLoaded(documents);
  },
};
