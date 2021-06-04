import { range } from 'lodash';
import {
  annotationReportModule,
  assignationModule,
  documentModule,
  monitoringEntryModule,
  treatmentModule,
  idModule,
  userModule,
} from '@label/core';
import { projectFakeObjects } from '../../../repository';
import { dateBuilder } from '../../../utils';
import { buildAnnotationReportRepository } from '../../annotationReport';
import { buildAssignationRepository } from '../../assignation';
import { buildMonitoringEntryRepository } from '../../monitoringEntry';
import { buildTreatmentRepository } from '../../treatment';
import { buildUserRepository } from '../../user';
import { buildDocumentRepository } from '../repository';
import { buildDocumentService, documentService } from './documentService';

describe('documentService', () => {
  const annotationReportRepository = buildAnnotationReportRepository();
  const assignationRepository = buildAssignationRepository();
  const documentRepository = buildDocumentRepository();
  const monitoringEntryRepository = buildMonitoringEntryRepository();
  const treatmentRepository = buildTreatmentRepository();

  describe('deleteDocument', () => {
    it('should remove the given document from the database with all its dependencies', async () => {
      const documentId = idModule.lib.buildId();
      const annotationReports = ([
        { documentId },
        { documentId },
        { documentId: idModule.lib.buildId() },
      ] as const).map(annotationReportModule.generator.generate);
      const assignations = ([
        { documentId },
        { documentId },
        { documentId: idModule.lib.buildId() },
      ] as const).map(assignationModule.generator.generate);
      const documents = ([
        { _id: documentId },
        { _id: idModule.lib.buildId() },
      ] as const).map(documentModule.generator.generate);
      const monitoringEntries = ([
        { documentId },
        { documentId },
        { documentId: idModule.lib.buildId() },
      ] as const).map(monitoringEntryModule.generator.generate);
      const treatments = ([
        { documentId },
        { documentId },
        { documentId: idModule.lib.buildId() },
      ] as const).map(treatmentModule.generator.generate);
      await Promise.all(
        annotationReports.map(annotationReportRepository.insert),
      );
      await Promise.all(assignations.map(assignationRepository.insert));
      await Promise.all(documents.map(documentRepository.insert));
      await Promise.all(
        monitoringEntries.map(monitoringEntryRepository.insert),
      );
      await Promise.all(treatments.map(treatmentRepository.insert));

      await documentService.deleteDocument(documentId);

      const annotationReportsAfterRemove = await annotationReportRepository.findAll();
      const assignationsAfterRemove = await assignationRepository.findAll();
      const documentsAfterRemove = await documentRepository.findAll();
      const monitoringEntriesAfterRemove = await monitoringEntryRepository.findAll();
      const treatmentsAfterRemove = await treatmentRepository.findAll();
      expect(annotationReportsAfterRemove).toEqual([annotationReports[2]]);
      expect(assignationsAfterRemove).toEqual([assignations[2]]);
      expect(documentsAfterRemove).toEqual([documents[1]]);
      expect(monitoringEntriesAfterRemove).toEqual([monitoringEntries[2]]);
      expect(treatmentsAfterRemove).toEqual([treatments[2]]);
    });
  });

  describe('fetchDocumentsReadyToExport', () => {
    it('should fetch all the documents done more than the given days ago', async () => {
      const days = 10;
      const documents = ([
        { status: 'done', updateDate: dateBuilder.daysAgo(13) },
        { status: 'pending' },
        { status: 'done', updateDate: dateBuilder.daysAgo(20) },
        { status: 'done', updateDate: dateBuilder.daysAgo(8) },
      ] as const).map(documentModule.generator.generate);
      await Promise.all(documents.map(documentRepository.insert));

      const documentsReadyToExport = await documentService.fetchDocumentsReadyToExport(
        days,
      );

      expect(documentsReadyToExport.sort()).toEqual(
        [documents[0], documents[2]].sort(),
      );
    });
  });

  describe('fetchSpecialDocuments', () => {
    it('should fetch all the special documents', async () => {
      const documents = [
        { status: 'done' as const, publicationCategory: ['P'] },
        { status: 'pending' as const, publicationCategory: [] },
        { status: 'done' as const, publicationCategory: ['I'] },
        { status: 'done' as const, publicationCategory: [] },
      ].map(documentModule.generator.generate);
      await Promise.all(documents.map(documentRepository.insert));

      const specialDocuments = await documentService.fetchSpecialDocuments();

      const { _id, status, creationDate, documentNumber } = documents[0];
      expect(specialDocuments).toEqual([
        { _id, status, creationDate, documentNumber },
      ]);
    });
  });

  describe('fetchDocumentsWithoutAnnotations', () => {
    it('should fetch all the documents without annotation report', async () => {
      const documentsWithTreatments = range(5).map(() =>
        documentModule.generator.generate(),
      );
      const documentWithoutTreatments = documentModule.generator.generate({
        priority: 'high',
        status: 'loaded',
      });
      const treatments = documentsWithTreatments.map((document) =>
        treatmentModule.generator.generate({ documentId: document._id }),
      );
      await Promise.all(
        [...documentsWithTreatments, documentWithoutTreatments].map(
          documentRepository.insert,
        ),
      );
      await Promise.all(treatments.map(treatmentRepository.insert));

      const documentWithoutAnnotations = await documentService.fetchDocumentWithoutAnnotations();

      expect(documentWithoutAnnotations).toEqual(documentWithoutTreatments);
    });
  });

  describe('fetchDocumentsForUser', () => {
    it('should fetch a document already assignated if it exists', async () => {
      const userId = idModule.lib.buildId();
      const document = documentModule.generator.generate({
        status: 'pending',
        text: 'lili',
      });
      await documentRepository.insert(document);
      await assignationRepository.insert(
        assignationModule.generator.generate({
          userId,
          documentId: document._id,
        }),
      );

      const documentsForUser = await documentService.fetchDocumentsForUser(
        userId,
        1,
      );

      expect(documentsForUser[0]).toEqual(document);
    });

    it('should fetch a document assignated to nobody if there are no assignation for this user', async () => {
      const userId1 = idModule.lib.buildId();
      const userId2 = idModule.lib.buildId();
      const documentofUser1 = documentModule.generator.generate({
        text: 'lolo',
        status: 'free',
      });
      await documentRepository.insert(documentofUser1);
      const documentOfUser2 = documentModule.generator.generate({
        text: 'lala',
        status: 'pending',
      });
      await documentRepository.insert(documentOfUser2);
      await assignationRepository.insert(
        assignationModule.generator.generate({
          userId: userId2,
          documentId: documentOfUser2._id,
        }),
      );
      const treatment1 = treatmentModule.generator.generate({
        documentId: documentofUser1._id,
      });
      const treatment2 = treatmentModule.generator.generate({
        documentId: documentOfUser2._id,
      });
      await treatmentRepository.insert(treatment1);
      await treatmentRepository.insert(treatment2);

      const documentsForUser = await documentService.fetchDocumentsForUser(
        userId1,
        1,
      );

      expect(documentsForUser[0]).toEqual(documentofUser1);
    });

    it('should fetch a document with the highest priority assignated to nobody if there are no assignation for this user', async () => {
      const userId1 = idModule.lib.buildId();
      const userId2 = idModule.lib.buildId();
      const documents = ([
        {
          text: 'lolo',
          priority: 'low',
          status: 'free',
        },
        {
          text: 'lala',
          priority: 'medium',
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
          userId: userId2,
          documentId: documents[2]._id,
        }),
      );

      const documentsForUser = await documentService.fetchDocumentsForUser(
        userId1,
        1,
      );

      expect(documentsForUser[0]).toEqual(documents[1]);
    });

    it('should fetch a document with treatment first', async () => {
      const userId1 = idModule.lib.buildId();
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

      const documentsForUser = await documentService.fetchDocumentsForUser(
        userId1,
        1,
      );

      expect(documentsForUser[0]).toEqual(documents[1]);
    });

    it('should not assign more document if one is already saved', async () => {
      const userId1 = idModule.lib.buildId();
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
          userId: userId1,
          documentId: documents[0]._id,
          treatmentId: treatments[0]._id,
        }),
        assignationModule.generator.generate({
          userId: userId1,
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
        userId1,
        3,
      );

      expect(documentsForUser.sort()).toEqual(
        [documents[0], documents[1]].sort(),
      );
    });

    it('should throw an error on too many attempts', async () => {
      const documentService = buildDocumentService();
      const userId = idModule.lib.buildId();
      const documents = range(301).map(() =>
        documentModule.generator.generate(),
      );
      const treatments = documents.map((document) =>
        treatmentModule.generator.generate({ documentId: document._id }),
      );
      await Promise.all(treatments.map(treatmentRepository.insert));
      await Promise.all(documents.map(documentRepository.insert));
      await documentService.fetchDocumentsForUser(userId, 300);

      const promise = () => documentService.fetchDocumentsForUser(userId, 1);

      await expect(promise()).rejects.toThrow(
        `Too many call attempts for identifier ${idModule.lib.convertToString(
          userId,
        )}`,
      );
    });
  });

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
      await Promise.all(
        [freeDocument, pendingDocument, savedDocument, doneDocument].map(
          documentRepository.insert,
        ),
      );
      await Promise.all(
        [
          pendingDocumentAssignation,
          savedDocumentAssignation,
          doneDocumentAssignation,
        ].map(assignationRepository.insert),
      );
      await userRepository.insert(user);

      const untreatedDocuments = await documentService.fetchUntreatedDocuments();

      expect(untreatedDocuments.sort()).toEqual([
        {
          document: projectFakeObjects(freeDocument, [
            '_id',
            'documentNumber',
            'publicationCategory',
            'source',
            'status',
            'creationDate',
          ]),
          userNames: [],
        },
        {
          document: projectFakeObjects(pendingDocument, [
            '_id',
            'documentNumber',
            'publicationCategory',
            'source',
            'status',
            'creationDate',
          ]),
          userNames: ['NAME'],
        },
        {
          document: projectFakeObjects(savedDocument, [
            '_id',
            'documentNumber',
            'publicationCategory',
            'source',
            'status',
            'creationDate',
          ]),
          userNames: ['NAME'],
        },
      ]);
    });
  });

  describe('fetchTreatedDocuments', () => {
    const documentRepository = buildDocumentRepository();
    const assignationRepository = buildAssignationRepository();
    const userRepository = buildUserRepository();

    it('should return treated documents', async () => {
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
      const savedTreatment = treatmentModule.generator.generate({
        documentId: savedDocument._id,
      });
      const doneTreatment = treatmentModule.generator.generate({
        documentId: doneDocument._id,
      });
      const pendingDocumentAssignation = assignationModule.generator.generate({
        documentId: pendingDocument._id,
        userId: user._id,
      });
      const savedDocumentAssignation = assignationModule.generator.generate({
        documentId: savedDocument._id,
        userId: user._id,
        treatmentId: savedTreatment._id,
      });
      const doneDocumentAssignation = assignationModule.generator.generate({
        documentId: doneDocument._id,
        userId: user._id,
        treatmentId: doneTreatment._id,
      });
      await Promise.all(
        [freeDocument, pendingDocument, savedDocument, doneDocument].map(
          documentRepository.insert,
        ),
      );
      await Promise.all(
        [savedTreatment, doneTreatment].map(treatmentRepository.insert),
      );
      await Promise.all(
        [
          pendingDocumentAssignation,
          savedDocumentAssignation,
          doneDocumentAssignation,
        ].map(assignationRepository.insert),
      );
      await userRepository.insert(user);

      const treatedDocuments = await documentService.fetchTreatedDocuments();

      expect(treatedDocuments.sort()).toEqual([
        {
          document: projectFakeObjects(doneDocument, [
            '_id',
            'documentNumber',
            'publicationCategory',
            'source',
          ]),
          treatments: [
            projectFakeObjects(doneTreatment, [
              '_id',
              'addedAnnotationsCount',
              'deletedAnnotationsCount',
              'documentId',
              'duration',
              'lastUpdateDate',
              'modifiedAnnotationsCount',
              'resizedBiggerAnnotationsCount',
              'resizedSmallerAnnotationsCount',
              'source',
            ]),
          ],
          userNames: ['NAME'],
        },
      ]);
    });
  });

  describe('updateDocumentStatus', () => {
    it('should update document status', async () => {
      const document = documentModule.generator.generate({ status: 'free' });
      await documentRepository.insert(document);

      await documentService.updateDocumentStatus(document._id, 'pending');

      const updatedDocument = await documentRepository.findById(document._id);
      expect(updatedDocument.status).toEqual('pending');
    });

    it('should update document status and set documents free', async () => {
      const assignationRepository = buildAssignationRepository();
      const document = documentModule.generator.generate({ status: 'pending' });
      const treatment = treatmentModule.generator.generate();
      const assignation = assignationModule.generator.generate({
        documentId: document._id,
        treatmentId: treatment._id,
      });
      await documentRepository.insert(document);
      await assignationRepository.insert(assignation);
      await treatmentRepository.insert(treatment);

      await documentService.updateDocumentStatus(document._id, 'free');

      const assignations = await assignationRepository.findAll();
      const treatments = await treatmentRepository.findAll();
      expect(assignations).toEqual([]);
      expect(treatments).toEqual([]);
    });
  });
});
