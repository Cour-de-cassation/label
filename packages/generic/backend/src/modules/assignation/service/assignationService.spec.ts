import { assignationModule, idModule } from '@label/core';
import { buildAssignationRepository } from '../repository';
import { assignationService } from './assignationService';

describe('assignationService', () => {
  describe('fetchDocumentIdsAssignatedByUserId', () => {
    const assignationRepository = buildAssignationRepository();

    it('should fetch all the document ids indexed by userId', async () => {
      const userId1 = idModule.lib.buildId();
      const userId2 = idModule.lib.buildId();
      const assignements = [
        { userId: userId1 },
        { userId: userId1 },
        { userId: userId2 },
        { userId: userId2 },
        { userId: userId2 },
      ].map(assignationModule.generator.generate);
      await Promise.all(assignements.map(assignationRepository.insert));

      const documentIdsAssignatedByUserId = await assignationService.fetchDocumentIdsAssignatedByUserId();

      expect(documentIdsAssignatedByUserId).toEqual({
        [idModule.lib.convertToString(userId1)]: [
          assignements[0].documentId,
          assignements[1].documentId,
        ],
        [idModule.lib.convertToString(userId2)]: [
          assignements[2].documentId,
          assignements[3].documentId,
          assignements[4].documentId,
        ],
      });
    });
  });
});
