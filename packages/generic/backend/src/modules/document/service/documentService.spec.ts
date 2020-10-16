import { range } from 'lodash';
import {
  annotationReportModule,
  assignationModule,
  documentModule,
  idModule,
  idType,
} from '@label/core';
import { buildAnnotationReportRepository } from '../../annotationReport';
import { buildAssignationRepository } from '../../assignation';
import { buildDocumentRepository } from '../repository';
import { documentService } from './documentService';

describe('documentService', () => {
  describe('fetchDocumentsWithoutAnnotations', () => {
    const annotationReportRepository = buildAnnotationReportRepository();
    const documentRepository = buildDocumentRepository();

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
      const document = await generateDocumentInDb({
        userIdToAssignate: userId,
      });

      const documentForUser = await documentService.fetchDocumentForUser(
        userId,
      );

      expect(documentForUser).toEqual(document);
    });

    it('should fetch a document assignated to nobody if there are no assignation for this user', async () => {
      const userId1 = idModule.lib.buildId();
      const userId2 = idModule.lib.buildId();
      const document = await generateDocumentInDb({});
      await generateDocumentInDb({
        userIdToAssignate: userId2,
      });

      const documentForUser = await documentService.fetchDocumentForUser(
        userId1,
      );

      expect(documentForUser).toEqual(document);
    });
  });
});

async function generateDocumentInDb({
  userIdToAssignate,
}: {
  userIdToAssignate?: idType;
}) {
  const assignationRepository = buildAssignationRepository();
  const documentRepository = buildDocumentRepository();

  const document = documentModule.generator.generate();
  await documentRepository.insert(document);

  if (userIdToAssignate) {
    const assignation = assignationModule.generator.generate({
      userId: userIdToAssignate,
      documentId: document._id,
    });
    assignationRepository.insert(assignation);
  }

  return document;
}
