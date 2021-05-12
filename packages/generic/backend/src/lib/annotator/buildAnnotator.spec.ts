import {
  annotationModule,
  annotationReportModule,
  documentModule,
} from '@label/core';
import {
  documentService,
  buildDocumentRepository,
} from '../../modules/document';
import { annotatorConfigType } from './annotatorConfigType';
import { buildAnnotator } from './buildAnnotator';

describe('buildAnnotator', () => {
  describe('annotateDocumentsWithoutAnnotations', () => {
    it('should annotate all the documents without annotations', async () => {
      await insertNDocumentsWithoutAnnotationsInDb(5);
      const fakeAnnotator = buildFakeAnnotatorConfig();
      const annotator = buildAnnotator('{}', fakeAnnotator);

      await annotator.annotateDocumentsWithoutAnnotations();

      const documentWithoutAnnotations = await documentService.fetchDocumentWithoutAnnotations();
      expect(documentWithoutAnnotations).toEqual(undefined);
    });
  });

  describe('reAnnotateUntreatedDocuments', () => {
    it('should re annotate all the documents', async () => {
      await insertNDocumentsWithoutAnnotationsInDb(5);
      const fakeAnnotator = buildFakeAnnotatorConfig();
      const annotator = buildAnnotator('{}', fakeAnnotator);
      await annotator.annotateDocumentsWithoutAnnotations();

      await annotator.reAnnotateUntreatedDocuments();

      const documentWithoutAnnotations = await documentService.fetchDocumentWithoutAnnotations();
      expect(documentWithoutAnnotations).toEqual(undefined);
    });
  });
});

async function insertNDocumentsWithoutAnnotationsInDb(n: number) {
  const documents = [...Array(n).keys()].map(() =>
    documentModule.generator.generate(),
  );

  const documentRepository = buildDocumentRepository();
  await Promise.all(documents.map(documentRepository.insert));

  return documents;
}

function buildFakeAnnotatorConfig(): annotatorConfigType {
  return {
    name: 'FAKE_ANNOTATOR',
    async fetchAnnotationOfDocument(settings, document) {
      const annotations = [...Array(5).keys()].map(() =>
        annotationModule.generator.generate(),
      );
      const report = annotationReportModule.generator.generate({
        documentId: document._id,
      });

      return { annotations, documentId: document._id, report };
    },
  };
}
