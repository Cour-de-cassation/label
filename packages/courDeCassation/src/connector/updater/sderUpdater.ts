import { documentType, environmentType } from '@label/core';
import { sderApi } from '../../sderApi';

export { sderUpdater };

const sderUpdater = {
  async updateDocumentsToBeTreatedStatus({
    documents,
    environment,
  }: {
    documents: documentType[];
    environment: environmentType;
  }) {
    await sderApi.setCourtDecisionsToBeTreated({ documents, environment });
  },
  async updateDocumentsLoadedStatus({
    documents,
    environment,
  }: {
    documents: documentType[];
    environment: environmentType;
  }) {
    await sderApi.setCourtDecisionsLoaded({ documents, environment });
  },
};
