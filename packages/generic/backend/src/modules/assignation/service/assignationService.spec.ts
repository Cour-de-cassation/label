import { assignationModule, idModule } from '@label/core';
import { buildAssignationRepository } from '../repository';
import { assignationService } from './assignationService';

describe('assignationService', () => {
  describe('fetchAssignationId', () => {
    const assignationRepository = buildAssignationRepository();

    const userId = idModule.lib.buildId();
    const documentId = idModule.lib.buildId();

    it('should fetch the assignation id corresponding to the given user id and document id', async () => {
      const assignation = assignationModule.generator.generate({
        userId,
        documentId,
        status: 'pending',
      });
      await assignationRepository.insert(assignation);

      const assignationId = await assignationService.fetchAssignationId({
        userId,
        documentId,
      });

      expect(assignationId).toEqual(assignation._id);
    });
    it('should return undefined if no assignation exists for the given user id and document id', async () => {
      const assignationId = await assignationService.fetchAssignationId({
        userId,
        documentId,
      });

      expect(assignationId).toEqual(undefined);
    });
  });

  describe('fetchDocumentIdAssignatedToUserId', () => {
    const assignationRepository = buildAssignationRepository();

    const userId1 = idModule.lib.buildId();
    const userId2 = idModule.lib.buildId();

    it('should fetch a document id assignated to the given userId', async () => {
      const assignements = ([
        { userId: userId1, status: 'pending' },
        { userId: userId1, status: 'done' },
        { userId: userId2, status: 'pending' },
      ] as const).map(assignationModule.generator.generate);
      await Promise.all(assignements.map(assignationRepository.insert));

      const documentIdAssignatedToUserId = await assignationService.fetchDocumentIdAssignatedToUserId(
        userId1,
      );

      expect(documentIdAssignatedToUserId).toEqual(assignements[0].documentId);
    });
    it('should fetch a document id assignated to the given userId with the biggest priority', async () => {
      const assignements = ([
        { userId: userId1, status: 'pending' },
        { userId: userId1, status: 'saved' },
        { userId: userId2, status: 'pending' },
      ] as const).map(assignationModule.generator.generate);
      await Promise.all(assignements.map(assignationRepository.insert));

      const documentIdAssignatedToUserId = await assignationService.fetchDocumentIdAssignatedToUserId(
        userId1,
      );

      expect(documentIdAssignatedToUserId).toEqual(assignements[1].documentId);
    });
    it('should return undefined if there is no document id assignated to the given userId', async () => {
      const assignements = ([
        { userId: userId1, status: 'pending' },
      ] as const).map(assignationModule.generator.generate);
      await Promise.all(assignements.map(assignationRepository.insert));

      const documentIdAssignatedToUserId = await assignationService.fetchDocumentIdAssignatedToUserId(
        userId2,
      );

      expect(documentIdAssignatedToUserId).toEqual(undefined);
    });
  });

  describe('fetchAllAssignatedDocumentIds', () => {
    const assignationRepository = buildAssignationRepository();

    it('should fetch all the assignated document id which are pending or saved', async () => {
      const userId1 = idModule.lib.buildId();
      const userId2 = idModule.lib.buildId();
      const assignements = ([
        { userId: userId1, status: 'pending' },
        { userId: userId1, status: 'done' },
        { userId: userId2, status: 'pending' },
      ] as const).map(assignationModule.generator.generate);
      await Promise.all(assignements.map(assignationRepository.insert));

      const assignatedDocumentIds = await assignationService.fetchAllAssignatedDocumentIds();

      expect(assignatedDocumentIds).toEqual([
        assignements[0].documentId,
        assignements[2].documentId,
      ]);
    });
  });

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

  describe('updateStatus', () => {
    const assignationRepository = buildAssignationRepository();

    it('should fetch all the document ids indexed by userId', async () => {
      const userId = idModule.lib.buildId();
      const documentId = idModule.lib.buildId();
      const assignement = assignationModule.generator.generate({
        userId,
        documentId,
      });
      await assignationRepository.insert(assignement);

      await assignationService.updateStatus(userId, documentId, 'done');

      const assignementAfterCall = await assignationRepository.findById(
        assignement._id,
      );
      expect(assignementAfterCall.status).toEqual('done');
    });
  });
});
