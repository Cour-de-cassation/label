import { documentType, documentModule, settingsModule } from '@label/core';
import { nlpFakeServer } from '../test/server';
import { buildNlpFetcher } from './nlpFetcher';

describe('nlpFetcher', () => {
  const nlpFetcher = buildNlpFetcher('http://127.0.0.1:8081');
  beforeEach(() => {
    nlpFakeServer.reinitialize();
  });

  describe('fetchAnnotationOfDocument', () => {
    const settings = settingsModule.lib.buildSettings({ LABEL: {} });
    let document: documentType;

    beforeEach(() => {
      document = documentModule.generator.generate();
      nlpFakeServer.reinitialize();
    });

    it('should fetch the annotation report from the nlp engine of the given document', async () => {
      const { report } = await nlpFetcher.fetchAnnotationOfDocument(
        settings,
        document,
      );

      const nlpAnnotations = nlpFakeServer.getNlpAnnotations();
      expect(report.checklist).toEqual(nlpAnnotations.checklist);
      expect(report.documentId).toEqual(document._id);
    });
    it('should fetch all the annotations from the nlp engine of the given document', async () => {
      const { annotations } = await nlpFetcher.fetchAnnotationOfDocument(
        settings,
        document,
      );

      const nlpAnnotations = nlpFakeServer.getNlpAnnotations();
      nlpAnnotations.entities.forEach((nlpAnnotation) => {
        expect(
          annotations.some(
            (annotation) =>
              annotation.start === nlpAnnotation.start &&
              annotation.category === nlpAnnotation.label,
          ),
        ).toEqual(true);
      });
    });
    it('should return the document id', async () => {
      const { documentId } = await nlpFetcher.fetchAnnotationOfDocument(
        settings,
        document,
      );

      expect(documentId).toEqual(document._id);
    });
  });
});
