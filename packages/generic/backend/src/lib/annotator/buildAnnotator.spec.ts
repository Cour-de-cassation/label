import { annotationModule, documentModule, settingsModule } from '@label/core';
import { range } from 'lodash';
import {
  documentService,
  buildDocumentRepository,
} from '../../modules/document';
import { annotatorConfigType } from './annotatorConfigType';
import { buildAnnotator } from './buildAnnotator';

describe('buildAnnotator', () => {
  const settings = settingsModule.lib.buildSettings({
    prenom: { status: 'annotable' },
  });
  describe('annotateDocumentsWithoutAnnotations', () => {
    it('should annotate all the documents without annotations', async () => {
      await insertNDocumentsWithoutAnnotationsInDb(5);
      const fakeAnnotator = buildFakeAnnotatorConfig();
      const annotator = buildAnnotator(settings, fakeAnnotator);

      await annotator.annotateDocumentsWithoutAnnotations();

      const documentWithoutAnnotations = await documentService.fetchDocumentWithoutAnnotationsNotIn(
        [],
      );
      expect(documentWithoutAnnotations).toEqual(undefined);
    });
  });
});

async function insertNDocumentsWithoutAnnotationsInDb(n: number) {
  const documents = [...Array(n).keys()].map(() =>
    documentModule.generator.generate({ status: 'loaded' }),
  );

  const documentRepository = buildDocumentRepository();
  await Promise.all(documents.map(documentRepository.insert));

  return documents;
}

function buildFakeAnnotatorConfig(): annotatorConfigType {
  return {
    name: 'FAKE_ANNOTATOR',
    async fetchAnnotationOfDocument(settings, document) {
      const category = Object.keys(settings)[0];
      const annotations = range(5).map((_, index) =>
        annotationModule.lib.buildAnnotation({
          text: 'TEXT',
          start: index * 10,
          category,
          score: Math.random(),
        }),
      );
      const checklist = documentModule.checklistGenerator.generate(4);

      const version = documentModule.generator.generate().nlpVersions;

      return { annotations, documentId: document._id, checklist, version };
    },
    async fetchLossOfDocument() {
      return 0;
    },
  };
}
