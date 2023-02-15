import { assignationModule, documentModule, userModule } from '@label/core';
import { buildAssignationRepository } from '../../../assignation/repository';
import { buildUserRepository } from '../../../user/repository';
import { buildDocumentRepository } from '../../repository';
import { countDoneDocuments } from './countDoneDocuments';

describe('countDoneDocuments', () => {
  const documentRepository = buildDocumentRepository();
  const assignationRepository = buildAssignationRepository();
  const userRepository = buildUserRepository();

  it('should return locked documents', async () => {
    const user = userModule.generator.generate({
      name: 'NAME',
      role: 'annotator',
    });
    const freeDocument = documentModule.generator.generate({
      status: 'free',
    });
    const pendingDocument = documentModule.generator.generate({
      status: 'pending',
    });
    const savedDocument = documentModule.generator.generate({
      status: 'saved',
    });
    const doneDocument = documentModule.generator.generate({
      status: 'done',
    });
    const toBePublishedDocument = documentModule.generator.generate({
      status: 'toBePublished',
    });
    const rejectedDocument = documentModule.generator.generate({
      status: 'rejected',
    });
    const lockedDocument = documentModule.generator.generate({
      status: 'locked',
    });
    const pendingDocumentAssignation = assignationModule.generator.generate({
      documentId: pendingDocument._id,
      userId: user._id,
    });
    const savedDocumentAssignation = assignationModule.generator.generate({
      documentId: savedDocument._id,
      userId: user._id,
    });
    const doneDocumentAssignation = assignationModule.generator.generate({
      documentId: doneDocument._id,
      userId: user._id,
    });
    const rejectedDocumentAssignation = assignationModule.generator.generate({
      documentId: rejectedDocument._id,
      userId: user._id,
    });
    const lockedDocumentAssignation = assignationModule.generator.generate({
      documentId: lockedDocument._id,
      userId: user._id,
    });
    await Promise.all(
      [
        freeDocument,
        pendingDocument,
        savedDocument,
        doneDocument,
        toBePublishedDocument,
        rejectedDocument,
        lockedDocument,
      ].map(documentRepository.insert),
    );
    await Promise.all(
      [
        pendingDocumentAssignation,
        savedDocumentAssignation,
        doneDocumentAssignation,
        rejectedDocumentAssignation,
        lockedDocumentAssignation,
      ].map(assignationRepository.insert),
    );
    await userRepository.insert(user);

    const doneDocumentsCount = await countDoneDocuments();

    expect(doneDocumentsCount).toEqual(
      [doneDocument, toBePublishedDocument].length,
    );
  });
});
