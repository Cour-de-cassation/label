import {
  annotationModule,
  annotationReportModule,
  documentModule,
  documentType,
} from '@label/core';
import { buildAnnotationRepository } from '../../modules/annotation';
import { buildAnnotationReportRepository } from '../../modules/annotationReport';
import {
  documentService,
  buildDocumentRepository,
} from '../../modules/document';
import { annotatorConfigType } from './annotatorConfigType';
import { buildAnnotator } from './buildAnnotator';

describe('buildAnnotator', () => {
  let annotationRepository = buildAnnotationRepository();
  let annotationReportRepository = buildAnnotationReportRepository();

  beforeEach(() => {
    annotationRepository = buildAnnotationRepository();
    annotationReportRepository = buildAnnotationReportRepository();
  });

  describe('annotateDocumentsWithoutAnnotations', () => {
    it('should annotate all the documents without annotations', async () => {
      const documents = await insertNDocumentsWithoutAnnotationsInDb(5);
      const fakeAnnotator = buildFakeAnnotatorConfigForDocuments(documents);
      const annotator = buildAnnotator(fakeAnnotator);

      await annotator.annotateDocumentsWithoutAnnotations();

      const documentsWithoutAnnotations = await documentService.fetchDocumentsWithoutAnnotations();
      expect(documentsWithoutAnnotations).toEqual([]);
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

function buildFakeAnnotatorConfigForDocuments(
  documents: documentType[],
): annotatorConfigType {
  return {
    name: 'FAKE_ANNOTATOR',
    async fetchAnnotationOfDocument(document) {
      const annotations = [...Array(5).keys()].map(() =>
        annotationModule.generator.generate({ documentId: document._id }),
      );
      const report = annotationReportModule.generator.generate({
        documentId: document._id,
      });

      return { annotations, report };
    },
  };
}
