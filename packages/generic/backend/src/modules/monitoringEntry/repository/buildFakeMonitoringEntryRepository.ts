import { idModule, monitoringEntryType } from '@label/core';
import {
  buildFakeRepositoryBuilder,
  updateFakeCollection,
} from '../../../repository';
import { customMonitoringEntryRepositoryType } from './customMonitoringEntryRepositoryType';

export { buildFakeMonitoringEntryRepository };

const buildFakeMonitoringEntryRepository = buildFakeRepositoryBuilder<
  monitoringEntryType,
  customMonitoringEntryRepositoryType
>({
  collectionName: 'monitoringEntries',
  buildCustomFakeRepository: (collection) => ({
    async deleteByDocumentId(documentId) {
      updateFakeCollection(
        collection,
        collection.filter(
          (monitoryEntry) =>
            !idModule.lib.equalId(monitoryEntry.documentId, documentId),
        ),
      );
    },
  }),
});
