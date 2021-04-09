import { range } from 'lodash';
import {
  annotationReportModule,
  assignationModule,
  documentModule,
  monitoringEntryModule,
  treatmentModule,
  idModule,
} from '@label/core';
import { dateBuilder } from '../../../utils';
import { buildAnnotationReportRepository } from '../../annotationReport';
import { buildAssignationRepository } from '../../assignation';
import { buildMonitoringEntryRepository } from '../../monitoringEntry';
import { buildTreatmentRepository } from '../../treatment';
import { buildDocumentRepository } from '../repository';
import { documentService } from './documentService';

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

      expect(specialDocuments).toEqual([documents[0]]);
    });
  });

  describe('fetchDocumentsWithoutAnnotations', () => {
    it('should fetch all the documents without annotation report', async () => {
      const documentsWithTreatments = range(5).map(() =>
        documentModule.generator.generate(),
      );
      const documentsWithoutTreatments = range(3).map(() =>
        documentModule.generator.generate(),
      );
      const treatments = documentsWithTreatments.map((document) =>
        treatmentModule.generator.generate({ documentId: document._id }),
      );
      await Promise.all(
        [...documentsWithTreatments, ...documentsWithoutTreatments].map(
          documentRepository.insert,
        ),
      );
      await Promise.all(treatments.map(treatmentRepository.insert));

      const fetchedDocumentsWithoutAnnotations = await documentService.fetchDocumentsWithoutAnnotations();

      expect(fetchedDocumentsWithoutAnnotations.sort()).toEqual(
        documentsWithoutTreatments.sort(),
      );
    });
  });

  describe('fetchDocumentForUser', () => {
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

      const documentForUser = await documentService.fetchDocumentForUser(
        userId,
      );

      expect(documentForUser).toEqual(document);
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

      const documentForUser = await documentService.fetchDocumentForUser(
        userId1,
      );

      expect(documentForUser).toEqual(documentofUser1);
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
      await Promise.all(documents.map(documentRepository.insert));
      await assignationRepository.insert(
        assignationModule.generator.generate({
          userId: userId2,
          documentId: documents[2]._id,
        }),
      );

      const documentForUser = await documentService.fetchDocumentForUser(
        userId1,
      );

      expect(documentForUser).toEqual(documents[1]);
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
