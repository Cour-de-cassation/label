import { range } from 'lodash';
import {
  assignationModule,
  documentModule,
  idModule,
  treatmentModule,
  userModule,
} from '@label/core';
import { buildAssignationRepository } from '../../../assignation/repository';
import { buildTreatmentRepository } from '../../../treatment/repository';
import { buildUserRepository } from '../../../user/repository';
import { buildDocumentRepository } from '../../repository';
import { buildDocumentService } from './';

describe('fetchDocumentsForUser', () => {
  const userRepository = buildUserRepository();
  const assignationRepository = buildAssignationRepository();
  const documentRepository = buildDocumentRepository();
  const treatmentRepository = buildTreatmentRepository();
  const documentService = buildDocumentService();

  it('should fetch a document already assignated if it exists', async () => {
    const user = userModule.generator.generate();
    const userId = user._id;
    const document = documentModule.generator.generate({
      status: 'pending',
      text: 'lili',
    });
    const assignation = assignationModule.generator.generate({
      userId,
      documentId: document._id,
    });
    await documentRepository.insert(document);
    await assignationRepository.insert(assignation);
    await userRepository.insert(user);

    const documentsForUser = await documentService.fetchDocumentsForUser(
      userId,
      1,
    );

    expect(documentsForUser[0]).toEqual({
      document,
      assignationId: assignation._id,
    });
  });

  it('should fetch a document assignated to nobody if there are no assignation for this user', async () => {
    const user1 = userModule.generator.generate();
    const user2 = userModule.generator.generate();
    const documentofUser1 = documentModule.generator.generate({
      text: 'lolo',
      status: 'free',
    });
    const documentOfUser2 = documentModule.generator.generate({
      text: 'lala',
      status: 'pending',
    });
    const assignation2 = assignationModule.generator.generate({
      userId: user2._id,
      documentId: documentOfUser2._id,
    });
    await documentRepository.insert(documentofUser1);
    await documentRepository.insert(documentOfUser2);
    await assignationRepository.insert(assignation2);
    await userRepository.insert(user1);
    await userRepository.insert(user2);
    const treatment1 = treatmentModule.generator.generate({
      documentId: documentofUser1._id,
    });
    const treatment2 = treatmentModule.generator.generate({
      documentId: documentOfUser2._id,
    });
    await treatmentRepository.insert(treatment1);
    await treatmentRepository.insert(treatment2);

    const documentsForUser = await documentService.fetchDocumentsForUser(
      user1._id,
      1,
    );
    const updatedDocument = await documentRepository.findById(
      documentofUser1._id,
    );
    expect(documentsForUser[0].document).toEqual(updatedDocument);
  });

  it('should fetch a document with the highest priority assignated to nobody if there are no assignation for this user', async () => {
    const user1 = userModule.generator.generate();
    const user2 = userModule.generator.generate();
    const documents = ([
      {
        text: 'lolo',
        priority: 0,
        status: 'free',
      },
      {
        text: 'lala',
        priority: 2,
        status: 'free',
      },
      {
        text: 'lala',
        status: 'pending',
      },
    ] as const).map(documentModule.generator.generate);
    const treatments = documents.map((document) =>
      treatmentModule.generator.generate({ documentId: document._id }),
    );
    await Promise.all(documents.map(documentRepository.insert));
    await Promise.all(treatments.map(treatmentRepository.insert));
    await assignationRepository.insert(
      assignationModule.generator.generate({
        userId: user2._id,
        documentId: documents[2]._id,
      }),
    );
    await userRepository.insert(user1);
    await userRepository.insert(user2);

    const documentsForUser = await documentService.fetchDocumentsForUser(
      user1._id,
      1,
    );

    const updatedDocument = await documentRepository.findById(documents[1]._id);
    expect(documentsForUser[0].document).toEqual(updatedDocument);
  });

  it('should not fetch any document because they are already assignated', async () => {
    const user1 = userModule.generator.generate();
    const user2 = userModule.generator.generate();
    const documents = ([
      {
        text: 'lolo',
        priority: 0,
        status: 'free',
      },
      {
        text: 'lala',
        priority: 2,
        status: 'free',
      },
      {
        text: 'lala',
        status: 'pending',
      },
    ] as const).map(documentModule.generator.generate);
    const treatments = documents.map((document) =>
      treatmentModule.generator.generate({ documentId: document._id }),
    );
    await Promise.all(documents.map(documentRepository.insert));
    await Promise.all(treatments.map(treatmentRepository.insert));
    await assignationRepository.insertMany([
      assignationModule.generator.generate({
        userId: user2._id,
        documentId: documents[0]._id,
      }),
      assignationModule.generator.generate({
        userId: user2._id,
        documentId: documents[1]._id,
      }),
      assignationModule.generator.generate({
        userId: user2._id,
        documentId: documents[2]._id,
      }),
    ]);
    await userRepository.insert(user1);
    await userRepository.insert(user2);

    const documentsForUser = await documentService.fetchDocumentsForUser(
      user1._id,
      3,
    );

    expect(documentsForUser.length).toEqual(0);
  });

  it('should fetch a document with treatment first', async () => {
    const user = userModule.generator.generate();
    const documents = range(3).map(() =>
      documentModule.generator.generate({
        status: 'free',
      }),
    );
    const treatment = treatmentModule.generator.generate({
      documentId: documents[1]._id,
    });
    await Promise.all(documents.map(documentRepository.insert));
    await treatmentRepository.insert(treatment);
    await userRepository.insert(user);

    const documentsForUser = await documentService.fetchDocumentsForUser(
      user._id,
      1,
    );

    const updatedDocument = await documentRepository.findById(documents[1]._id);
    expect(documentsForUser[0].document).toEqual(updatedDocument);
  });

  it('should not assign more document if one is already saved', async () => {
    const user = userModule.generator.generate();
    const documents = (['saved', 'pending', 'free'] as const).map((status) =>
      documentModule.generator.generate({ status }),
    );
    const treatments = documents.map((document) =>
      treatmentModule.generator.generate({
        documentId: document._id,
      }),
    );
    const assignations = [
      assignationModule.generator.generate({
        userId: user._id,
        documentId: documents[0]._id,
        treatmentId: treatments[0]._id,
      }),
      assignationModule.generator.generate({
        userId: user._id,
        documentId: documents[1]._id,
        treatmentId: treatments[1]._id,
      }),
    ];
    await Promise.all(assignations.map(assignationRepository.insert));
    await Promise.all(documents.map(documentRepository.insert));
    await Promise.all(
      treatments.map((treatment) => treatmentRepository.insert(treatment)),
    );

    const documentsForUser = await documentService.fetchDocumentsForUser(
      user._id,
      3,
    );

    expect(documentsForUser.sort()).toEqual(
      [
        { assignationId: assignations[0]._id, document: documents[0] },
        { assignationId: assignations[1]._id, document: documents[1] },
      ].sort(),
    );
  });

  it('should throw an error on too many attempts', async () => {
    const documentService = buildDocumentService();
    const user = userModule.generator.generate();
    const documents = range(301).map(() => documentModule.generator.generate());
    const treatments = documents.map((document) =>
      treatmentModule.generator.generate({ documentId: document._id }),
    );
    await Promise.all(treatments.map(treatmentRepository.insert));
    await Promise.all(documents.map(documentRepository.insert));
    await userRepository.insert(user);
    await documentService.fetchDocumentsForUser(user._id, 300);

    const promise = () => documentService.fetchDocumentsForUser(user._id, 1);

    await expect(promise()).rejects.toThrow(
      `Too many call attempts for identifier ${idModule.lib.convertToString(
        user._id,
      )}`,
    );
  });
});
