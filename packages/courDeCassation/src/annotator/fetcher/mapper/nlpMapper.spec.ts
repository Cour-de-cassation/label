import { documentModule } from '@label/core';
import { nlpResponseType } from '../api';
import { nlpMapper } from './nlpMapper';

const nlpVersion = {
  juriSpacyTokenizer: {
    version: '0.13.21',
    date: '2024-01-01 12:00:00',
  },
  juritools: {
    version: '0.13.21',
    date: '2024-01-01 12:00:00',
  },
  pseudonymisationApi: {
    version: '0.13.21',
    date: '2024-01-01 12:00:00',
  },
  model: {
    name: 'new_categories_model.pt',
  },
};

const nlpAnnotations: nlpResponseType = {
  entities: [
    {
      text: 'ANNOTATION1',
      start: 0,
      end: 11,
      category: 'LABEL1',
      source: 'NLP',
      score: 0.5,
      entityId: 'LABEL1_annotation1',
    },
    {
      text: 'ANNOTATION2',
      start: 12,
      end: 23,
      category: 'LABEL2',
      source: 'NLP',
      score: 0.6,
      entityId: 'LABEL2_annotation2',
    },
  ],
  checklist: [],
  versions: nlpVersion,
};

const nlpAnnotationsWithAdditionalTerms: nlpResponseType = {
  entities: [
    {
      text: 'ANNOTATION1',
      start: 0,
      end: 11,
      category: 'LABEL1',
      source: 'NLP',
      score: 0.5,
      entityId: 'LABEL1_annotation1',
    },
    {
      text: 'ANNOTATION2',
      start: 12,
      end: 23,
      category: 'LABEL2',
      source: 'NLP',
      score: 0.6,
      entityId: 'LABEL2_annotation2',
    },
  ],
  checklist: [],
  additionalTermsToUnAnnotate: ['blabla', 'toto'],
  versions: nlpVersion,
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
        score: 0.5,
        source: 'NLP',
      });
      expect(annotations[1]).toEqual({
        category: 'LABEL2',
        entityId: 'LABEL2_annotation2',
        start: 12,
        text: 'ANNOTATION2',
        score: 0.6,
        source: 'NLP',
      });
    });
  });
  describe('mapNlpAdditionalTerms', () => {
    it('should return undefined if there is no additionalTerms', () => {
      const additionalTerms = nlpMapper.mapNlpAdditionalTerms(nlpAnnotations);

      expect(additionalTerms).toEqual(undefined);
    });
  });
  describe('mapNlpAdditionalTerms', () => {
    it('should return mapped additional terms', () => {
      const additionalTerms = nlpMapper.mapNlpAdditionalTerms(
        nlpAnnotationsWithAdditionalTerms,
      );

      expect(additionalTerms).toEqual({
        additionalTermsToAnnotate: [],
        additionalTermsToUnAnnotate: ['blabla', 'toto'],
      });
    });
  });
});
