import { idModule, monitoringEntryModule } from '@label/core';
import { buildMonitoringEntryRepository } from '../repository';
import { monitoringEntryService } from './monitoringEntryService';

describe('monitoringEntryService', () => {
  const monitoringEntryRepository = buildMonitoringEntryRepository();

  describe('deleteMonitoringEntriesByDocumentId', () => {
    it('should remove all the monitoring entries from the database with the given document id', async () => {
      const documentId = idModule.lib.buildId();
      const monitoringEntries = ([
        { documentId },
        { documentId },
        { documentId: idModule.lib.buildId() },
      ] as const).map(monitoringEntryModule.generator.generate);
      await Promise.all(
        monitoringEntries.map(monitoringEntryRepository.insert),
      );

      await monitoringEntryService.deleteMonitoringEntriesByDocumentId(
        documentId,
      );

      const monitoringEntriesAfterRemove = await monitoringEntryRepository.findAll();
      expect(monitoringEntriesAfterRemove).toEqual([monitoringEntries[2]]);
    });
  });
});
