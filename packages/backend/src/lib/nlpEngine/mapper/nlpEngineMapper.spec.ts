import { annotationType, courtDecisionModule, mongoIdType } from '@label/core';
import { nlpEngineCourtDecisionAnnotationsType } from '../api';
import { nlpEngineMapper } from './nlpEngineMapper';

const nlpEngineAnnotations: nlpEngineCourtDecisionAnnotationsType = {
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
  checklist: ['CHECK 1', 'CHECK 1'],
};

const courtDecision = courtDecisionModule.generator.generate();

describe('nlpEngineMapper', () => {
  describe('mapNlpEngineAnnotationstoAnnotations', () => {
    it('should convert the nlp annotations into our annotations', () => {
      const annotations = nlpEngineMapper.mapNlpEngineAnnotationstoAnnotations(
        nlpEngineAnnotations,
        courtDecision,
      );

      expectValidAnnotation(annotations[0], {
        expectedCourtDecisionId: courtDecision._id,
        expectedNlpEntity: 'LABEL1',
        expectedSource: 'NLP',
        expectedStart: 0,
        expectedText: 'ANNOTATION1',
      });
      expectValidAnnotation(annotations[1], {
        expectedCourtDecisionId: courtDecision._id,
        expectedNlpEntity: 'LABEL2',
        expectedSource: 'NLP',
        expectedStart: 6,
        expectedText: 'ANNOTATION2',
      });

      function expectValidAnnotation(
        annotation: annotationType,
        {
          expectedCourtDecisionId,
          expectedNlpEntity,
          expectedSource,
          expectedStart,
          expectedText,
        }: {
          expectedCourtDecisionId: mongoIdType;
          expectedNlpEntity: string;
          expectedSource: string;
          expectedStart: number;
          expectedText: string;
        },
      ) {
        expect(annotation.courtDecisionId).toEqual(expectedCourtDecisionId);
        expect(annotation.nlpEntity.startsWith(expectedNlpEntity)).toEqual(
          true,
        );
        expect(annotation.source).toEqual(expectedSource);
        expect(annotation.start).toEqual(expectedStart);
        expect(annotation.text).toEqual(expectedText);
      }
    });
  });
  describe('mapNlpEngineAnnotationstoReport', () => {
    it('should convert the nlp annotations into our nlp report', () => {
      const nlpReport = nlpEngineMapper.mapNlpEngineAnnotationstoReport(
        nlpEngineAnnotations,
        courtDecision,
      );

      expect(nlpReport.checkList).toEqual(['CHECK 1', 'CHECK 1']);
      expect(nlpReport.checkNeeded).toEqual(true);
      expect(nlpReport.courtDecisionId).toEqual(courtDecision._id);
    });
  });
});
