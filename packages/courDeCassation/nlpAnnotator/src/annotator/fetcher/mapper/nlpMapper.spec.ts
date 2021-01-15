import { documentModule } from '@label/core';
import { nlpAnnotationsType } from '../api';
import { nlpMapper } from './nlpMapper';

const nlpAnnotations: nlpAnnotationsType = {
  entities: [
    {
      text: 'ANNOTATION1',
      start: 0,
      end: 11,
      label: 'LABEL1',
      source: 'NLP',
    },
    {
      text: 'ANNOTATION2',
      start: 6,
      end: 17,
      label: 'LABEL2',
      source: 'NLP',
    },
  ],
  check_needed: true,
  checklist: ['CHECK 1', 'CHECK 2'],
};

const document = documentModule.generator.generate();

describe('nlpMapper', () => {
  describe('mapNlpAnnotationsToAnnotations', () => {
    it('should convert the nlp annotations into our annotations', () => {
      const annotations = nlpMapper.mapNlpAnnotationsToAnnotations(
        nlpAnnotations,
      );

      expect(annotations[0]).toEqual({
        category: 'LABEL1',
        entityId: 'LABEL1_ANNOTATION1',
        start: 0,
        text: 'ANNOTATION1',
      });
      expect(annotations[1]).toEqual({
        category: 'LABEL2',
        entityId: 'LABEL2_ANNOTATION2',
        start: 6,
        text: 'ANNOTATION2',
      });
    });
  });
  describe('mapNlpAnnotationstoReport', () => {
    it('should convert the nlp annotations into an annotation report', () => {
      const annotationReport = nlpMapper.mapNlpAnnotationstoReport(
        nlpAnnotations,
        document,
      );

      expect(annotationReport).toEqual({
        checkList: ['CHECK 1', 'CHECK 2'],
        checkNeeded: true,
        documentId: document._id,
        _id: annotationReport._id,
      });
    });
  });
});
