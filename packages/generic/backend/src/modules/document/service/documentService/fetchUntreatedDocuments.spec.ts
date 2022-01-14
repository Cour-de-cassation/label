import {
  assignationModule,
  documentModule,
  documentType,
  userModule,
} from '@label/core';
import { projectFakeObjects } from '../../../../repository';
import { buildAssignationRepository } from '../../../assignation/repository';
import { buildUserRepository } from '../../../user/repository';
import { buildDocumentRepository } from '../../repository';
import { fetchUntreatedDocuments } from './fetchUntreatedDocuments';

describe('fetchUntreatedDocuments', () => {
  const documentRepository = buildDocumentRepository();
  const assignationRepository = buildAssignationRepository();
  const userRepository = buildUserRepository();

  it('should return untreated documents', async () => {
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
    const rejectedDocument = documentModule.generator.generate({
      status: 'rejected',
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
    await Promise.all(
      [
        freeDocument,
        pendingDocument,
        savedDocument,
        doneDocument,
        rejectedDocument,
      ].map(documentRepository.insert),
    );
    await Promise.all(
      [
        pendingDocumentAssignation,
        savedDocumentAssignation,
        doneDocumentAssignation,
        rejectedDocumentAssignation,
      ].map(assignationRepository.insert),
    );
    await userRepository.insert(user);

    const untreatedDocuments = await fetchUntreatedDocuments();

    expect(untreatedDocuments.sort()).toEqual([
      {
        document: projectDocument(freeDocument),
        userNames: [],
      },
      {
        document: projectDocument(pendingDocument),
        userNames: ['NAME'],
      },
      {
        document: projectDocument(savedDocument),
        userNames: ['NAME'],
      },
      {
        document: projectDocument(rejectedDocument),
        userNames: ['NAME'],
      },
    ]);
  });
});

function projectDocument(document: documentType) {
  return {
    ...projectFakeObjects(document, [
      '_id',
      'documentNumber',
      'creationDate',
      'publicationCategory',
      'source',
      'route',
      'status',
    ]),
    occultationBlock: document.decisionMetadata.occultationBlock,
    jurisdiction: document.decisionMetadata.jurisdiction,
    decisionDate: document.decisionMetadata.date,
  };
}
