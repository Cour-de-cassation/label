import { range } from 'lodash';
import { assignationModule, documentModule, idModule } from '@label/core';
import { buildDocumentRepository } from '../../../modules/document';
import { buildAssignationRepository } from '../repository';
import {
  fetchAssignationId,
  fetchDocumentIdsAssignatedToUserId,
  fetchAssignationsByDocumentIds,
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

  describe('fetchAssignationsByDocumentIds', () => {
    const documentRepository = buildDocumentRepository();
    const assignationRepository = buildAssignationRepository();
    const documents = range(3).map(() =>
      documentModule.generator.generate({ status: 'pending' }),
    );
    const assignations = documents.map((document) =>
      assignationModule.generator.generate({ documentId: document._id }),
    );

    it('should return assignations by document Id', async () => {
      await documentRepository.insertMany(documents);
      await assignationRepository.insertMany(assignations);

      const assignationsByDocumentIds = await fetchAssignationsByDocumentIds(
        [documents[0]._id, documents[1]._id],
        { assertEveryDocumentIsAssigned: true },
      );

      expect(assignationsByDocumentIds).toEqual({
        [idModule.lib.convertToString(documents[0]._id)]: [assignations[0]],
        [idModule.lib.convertToString(documents[1]._id)]: [assignations[1]],
      });
    });

    it('should throw error', async () => {
      await documentRepository.insertMany(documents);
      await assignationRepository.insert(assignations[0]);

      expect(
        fetchAssignationsByDocumentIds([documents[0]._id, documents[1]._id], {
          assertEveryDocumentIsAssigned: true,
        }),
      ).rejects.toThrowError(
        `The document ${idModule.lib.convertToString(
          documents[1]._id,
        )} has no matching assignations`,
      );
    });
  });

  describe('fetchDocumentIdsAssignatedToUserId', () => {
    const assignationRepository = buildAssignationRepository();

    const userId1 = idModule.lib.buildId();
    const userId2 = idModule.lib.buildId();

    it('should fetch all the document id assignated to the given userId', async () => {
      const assignations = (
        [{ userId: userId1 }, { userId: userId1 }, { userId: userId2 }] as const
      ).map(assignationModule.generator.generate);
      await Promise.all(assignations.map(assignationRepository.insert));

      const documentIdAssignatedToUserId =
        await fetchDocumentIdsAssignatedToUserId(userId1);

      expect(documentIdAssignatedToUserId.sort()).toEqual(
        [
          {
            documentId: assignations[0].documentId,
            assignationId: assignations[0]._id,
          },
          {
            documentId: assignations[1].documentId,
            assignationId: assignations[1]._id,
          },
        ].sort(),
      );
    });
    it('should return an empty array if there is no document id assignated to the given userId', async () => {
      const assignements = ([{ userId: userId1 }] as const).map(
        assignationModule.generator.generate,
      );
      await Promise.all(assignements.map(assignationRepository.insert));

      const documentIdAssignatedToUserId =
        await fetchDocumentIdsAssignatedToUserId(userId2);

      expect(documentIdAssignatedToUserId).toEqual([]);
    });
  });
});
