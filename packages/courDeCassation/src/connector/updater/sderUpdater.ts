import { documentType } from '@label/core';
import { sderApi } from '../../sderApi';

export { sderUpdater };

const sderUpdater = {
  async updateDocumentsToBeTreatedStatus({
    documents,
  }: {
    documents: documentType[];
  }) {
    await sderApi.setCourtDecisionsToBeTreated({ documents });
  },
  async updateDocumentsLoadedStatus({
    documents,
  }: {
    documents: documentType[];
  }) {
    await sderApi.setCourtDecisionsLoaded({ documents });
  },
};
