import {
  documentType,
  documentModule,
  annotationModule,
  annotationType,
  settingsModule,
} from '@label/core';
import { buildRegexFetcher } from './regexFetcher';

describe('regexFetcher', () => {
  describe('fetchAnnotationOfDocument', () => {
    const settings = settingsModule.lib.buildSettings({ regex: {} });
    let document: documentType;

    beforeEach(() => {
      document = documentModule.generator.generate({
        text: 'This is the document test text.',
      });
    });

    it('should fetch all the annotations from the regex rules of the given document', async () => {
      const regexFetcher = buildRegexFetcher(settings);
      const { annotations } = await regexFetcher.fetchAnnotationOfDocument(
        settings,
        document,
      );

      const regexAnnotations = [
        annotationModule.lib.buildAnnotation({
          category: 'regex',
          start: 21,
          certaintyScore: 1,
          text: 'test',
        }),
      ];

      console.log(regexAnnotations);
      console.log(annotations);
      regexAnnotations.forEach((regexAnnotation) => {
        expect(
          annotations.some(
            (annotation: annotationType) =>
              annotation.start === regexAnnotation.start &&
              annotation.category === regexAnnotation.category,
          ),
        ).toEqual(true);
      });
    });
    it('should return the document id', async () => {
      const regexFetcher = buildRegexFetcher(settings);
      const { documentId } = await regexFetcher.fetchAnnotationOfDocument(
        settings,
        document,
      );

      expect(documentId).toEqual(document._id);
    });
  });
});
