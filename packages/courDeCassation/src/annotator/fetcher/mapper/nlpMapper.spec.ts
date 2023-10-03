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
      score: 0.5,
      entityId: 'LABEL1_annotation1'
    },
    {
      text: 'ANNOTATION2',
      start: 12,
      end: 23,
      label: 'LABEL2',
      source: 'NLP',
      score: 0.6,
      entityId: 'LABEL2_annotation2'
    },
  ],
  checklist: ['CHECK 1', 'CHECK 2'],
};

const document = documentModule.generator.generate({
  text: 'ANNOTATION1 ANNOTATION2',
});

describe('nlpMapper', () => {
  describe('mapNlpAnnotationsToAnnotations', () => {
    it('should convert the nlp annotations into our annotations', () => {
      const annotations = nlpMapper.mapNlpAnnotationsToAnnotations(
        nlpAnnotations,
        document,
      );

      expect(annotations[0]).toEqual({
        category: 'LABEL1',
        entityId: 'LABEL1_annotation1',
        start: 0,
        text: 'ANNOTATION1',
        certaintyScore: 0.5,
      });
      expect(annotations[1]).toEqual({
        category: 'LABEL2',
        entityId: 'LABEL2_annotation2',
        start: 12,
        text: 'ANNOTATION2',
        certaintyScore: 0.6,
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
        checklist: ['CHECK 1', 'CHECK 2'],
        documentId: document._id,
        _id: annotationReport._id,
      });
    });
  });
});
