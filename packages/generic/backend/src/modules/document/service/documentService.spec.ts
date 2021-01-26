import { range } from 'lodash';
import {
  annotationReportModule,
  assignationModule,
  documentModule,
  idModule,
} from '@label/core';
import { buildAnnotationReportRepository } from '../../annotationReport';
import { buildAssignationRepository } from '../../assignation';
import { buildDocumentRepository } from '../repository';
import { documentService } from './documentService';

describe('documentService', () => {
  const assignationRepository = buildAssignationRepository();
  const annotationReportRepository = buildAnnotationReportRepository();
  const documentRepository = buildDocumentRepository();

  describe('fetchDocumentsWithoutAnnotations', () => {
    it('should fetch all the documents without annotation report', async () => {
      const documentsWithAnnotationReport = range(5).map(() =>
        documentModule.generator.generate(),
      );
      const documentsWithoutAnnotationReport = range(3).map(() =>
        documentModule.generator.generate(),
      );
      const annotationReports = documentsWithAnnotationReport.map((document) =>
        annotationReportModule.generator.generate({ documentId: document._id }),
      );
      await Promise.all(
        [
          ...documentsWithAnnotationReport,
          ...documentsWithoutAnnotationReport,
        ].map(documentRepository.insert),
      );
      await Promise.all(
        annotationReports.map(annotationReportRepository.insert),
      );

      const fetchedDocumentsWithoutAnnotations = await documentService.fetchDocumentsWithoutAnnotations();

      expect(fetchedDocumentsWithoutAnnotations.sort()).toEqual(
        documentsWithoutAnnotationReport.sort(),
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
  });

  describe('updateDocumentStatus', () => {
    it('should update document status', async () => {
      const document = documentModule.generator.generate({ status: 'free' });
      await documentRepository.insert(document);

      await documentService.updateDocumentStatus(document._id, 'pending');

      const updatedDocument = await documentRepository.findById(document._id);
      expect(updatedDocument.status).toEqual('free');
    });
  });
});
