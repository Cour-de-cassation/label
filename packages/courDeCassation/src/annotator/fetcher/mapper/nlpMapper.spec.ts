import { documentModule } from '@label/core';
import { nlpAnnotationsType } from '../api';
import { nlpMapper } from './nlpMapper';

const nlpAnnotations: nlpAnnotationsType = {
  entities: {
    tagger: [
      {
        text: 'ANNOTATION1',
        start: 0,
        end: 11,
        label: 'LABEL1',
        source: 'NLPTagger',
        score: 0.5,
      },
      {
        text: 'ANNOTATION2',
        start: 12,
        end: 23,
        label: 'LABEL2',
        source: 'NLPTagger',
        score: 0.6,
      },
    ],
    postProcess: [
      {
        text: 'ANNOTATION1',
        start: 0,
        end: 11,
        label: 'LABEL1',
        source: 'NLPTagger',
        score: 0.5,
      },
      {
        text: 'ANNOTATION2',
        start: 12,
        end: 23,
        label: 'LABEL2',
        source: 'NLPTagger',
        score: 0.6,
      },
      {
        text: 'ANNOTATION3',
        start: 24,
        end: 35,
        label: 'LABEL2',
        source: 'NLPPostProcess',
        score: 0.9,
      },
    ],
    output: [
      {
        text: 'ANNOTATION2',
        start: 12,
        end: 23,
        label: 'LABEL2',
        source: 'NLPTagger',
        score: 0.6,
      },
      {
        text: 'ANNOTATION3',
        start: 24,
        end: 35,
        label: 'LABEL2',
        source: 'NLPPostProcess',
        score: 0.9,
      },
    ],
  },

  checklist: ['CHECK 1', 'CHECK 2'],
};

const document = documentModule.generator.generate({
  text: 'ANNOTATION1 ANNOTATION2 ANNOTATION3',
});

describe('nlpMapper', () => {
  describe('mapNlpAnnotationsToAnnotations', () => {
    it('should convert the nlp annotations into our annotations', () => {
      const annotations = nlpMapper.mapNlpAnnotationsToAnnotations(
        nlpAnnotations,
        document,
      );
      console.log(annotations)
      expect(annotations[0][0]).toEqual({
        category: 'LABEL1',
        entityId: 'LABEL1_ANNOTATION1',
        start: 0,
        text: 'ANNOTATION1',
        certaintyScore: 0.5,
      });
      expect(annotations[0][1]).toEqual({
        category: 'LABEL2',
        entityId: 'LABEL2_ANNOTATION2',
        start: 12,
        text: 'ANNOTATION2',
        certaintyScore: 0.6,
      });
      expect(annotations[1][2]).toEqual({
        category: 'LABEL2',
        entityId: 'LABEL2_ANNOTATION3',
        start: 24,
        text: 'ANNOTATION3',
        certaintyScore: 0.9,
      });
      expect(annotations[2][0]).toEqual({
        category: 'LABEL2',
        entityId: 'LABEL2_ANNOTATION2',
        start: 12,
        text: 'ANNOTATION2',
        certaintyScore: 0.6,
      });
      expect(annotations[2][1]).toEqual({
        category: 'LABEL2',
        entityId: 'LABEL2_ANNOTATION3',
        start: 24,
        text: 'ANNOTATION3',
        certaintyScore: 0.9,
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
