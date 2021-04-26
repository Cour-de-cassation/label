import { assignationModule, idModule } from '@label/core';
import { buildAssignationRepository } from '../repository';
import {
  fetchAssignationId,
  fetchDocumentIdsAssignatedToUserId,
} from './fetch';

describe('fetch', () => {
  describe('fetchAssignationId', () => {
    const assignationRepository = buildAssignationRepository();

    const userId = idModule.lib.buildId();
    const documentId = idModule.lib.buildId();

    it('should fetch the assignation id corresponding to the given user id and document id', async () => {
      const assignation = assignationModule.generator.generate({
        userId,
        documentId,
      });
      await assignationRepository.insert(assignation);

      const assignationId = await fetchAssignationId({
        userId,
        documentId,
      });

      expect(assignationId).toEqual(assignation._id);
    });
    it('should return undefined if no assignation exists for the given user id and document id', async () => {
      const assignationId = await fetchAssignationId({
        userId,
        documentId,
      });

      expect(assignationId).toEqual(undefined);
    });
  });

  describe('fetchDocumentIdsAssignatedToUserId', () => {
    const assignationRepository = buildAssignationRepository();

    const userId1 = idModule.lib.buildId();
    const userId2 = idModule.lib.buildId();

    it('should fetch all the document id assignated to the given userId', async () => {
      const assignements = ([
        { userId: userId1 },
        { userId: userId1 },
        { userId: userId2 },
      ] as const).map(assignationModule.generator.generate);
      await Promise.all(assignements.map(assignationRepository.insert));

      const documentIdAssignatedToUserId = await fetchDocumentIdsAssignatedToUserId(
        userId1,
      );

      expect(documentIdAssignatedToUserId).toEqual([
        assignements[0].documentId,
        assignements[1].documentId,
      ]);
    });
    it('should return an empty array if there is no document id assignated to the given userId', async () => {
      const assignements = ([{ userId: userId1 }] as const).map(
        assignationModule.generator.generate,
      );
      await Promise.all(assignements.map(assignationRepository.insert));

      const documentIdAssignatedToUserId = await fetchDocumentIdsAssignatedToUserId(
        userId2,
      );

      expect(documentIdAssignatedToUserId).toEqual([]);
    });
  });
});
