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
      label: 'LABEL1',
      source: 'NLP',
      score: 0.5,
      entityId: 'LABEL1_annotation1',
    },
    {
      text: 'ANNOTATION2',
      start: 12,
      end: 23,
      label: 'LABEL2',
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
      label: 'LABEL1',
      source: 'NLP',
      score: 0.5,
      entityId: 'LABEL1_annotation1',
    },
    {
      text: 'ANNOTATION2',
      start: 12,
      end: 23,
      label: 'LABEL2',
      source: 'NLP',
      score: 0.6,
      entityId: 'LABEL2_annotation2',
    },
  ],
  checklist: [],
  additionalTermsToUnAnnotate: ['blabla', 'toto'],
  versions: nlpVersion,
};

const nlpAnnotationsWithChecklist: nlpResponseType = {
  entities: [
    {
      text: 'ANNOTATION1',
      start: 0,
      end: 11,
      label: 'LABEL1',
      source: 'NLP',
      score: 0.5,
      entityId: 'LABEL1_annotation1',
    },
  ],
  checklist: [
    {
      checkType: 'missing_something',
      message: "Label est-il un bon logiciel d'annotation ?",
      entities: [
        {
          text: 'Label',
          start: 0,
          end: 5,
          label: 'myCategory',
          source: 'source1',
          score: 0.85,
          entityId: 'myCategory',
        },
        {
          text: 'Application',
          start: 10,
          end: 15,
          label: 'myCategory',
          source: 'source2',
          score: 0.9,
          entityId: 'myCategory_application',
        },
      ],
      sentences: [
        {
          start: 0,
          end: 50,
        },
      ],
      metadata_text: ['Label', 'Applcation'],
    },
    {
      checkType: 'other',
      message:
        "L'annotation [Antoine] est présente dans les catégories [développeur, data scientist] est-ce une erreur ?",
      entities: [
        {
          text: 'Antoine',
          start: 20,
          end: 25,
          label: 'developpeur',
          source: 'nlp',
          score: 1,
          entityId: 'developpeur_antoine',
        },
      ],
      sentences: undefined,
      metadata_text: undefined,
    },
  ],
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
        nlpAnnotationsWithChecklist,
        document,
      );

      expect(annotationReport).toEqual({
        checklist: [
          {
            checkType: 'missing_something',
            message: "Label est-il un bon logiciel d'annotation ?",
            entities: [
              {
                text: 'Label',
                start: 0,
                end: 5,
                label: 'myCategory',
                source: 'source1',
                score: 0.85,
                entityId: 'myCategory',
              },
              {
                text: 'Application',
                start: 10,
                end: 15,
                label: 'myCategory',
                source: 'source2',
                score: 0.9,
                entityId: 'myCategory_application',
              },
            ],
            sentences: [
              {
                start: 0,
                end: 50,
              },
            ],
            metadata_text: ['Label', 'Applcation'],
          },
          {
            checkType: 'other',
            message:
              "L'annotation [Antoine] est présente dans les catégories [développeur, data scientist] est-ce une erreur ?",
            entities: [
              {
                text: 'Antoine',
                start: 20,
                end: 25,
                label: 'developpeur',
                source: 'nlp',
                score: 1,
                entityId: 'developpeur_antoine',
              },
            ],
            sentences: undefined,
            metadata_text: undefined,
          },
        ],
        documentId: document._id,
        _id: annotationReport._id,
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
