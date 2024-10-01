import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { annotationReportModel };

export type { annotationReportType };

const annotationReportModel = buildModel({
  kind: 'object',
  content: {
    checklist: {
      kind: 'or',
      content: [
        { kind: 'array', content: { kind: 'primitive', content: 'string' } }, // to remove when new checklist are fully implemented
        {
          kind: 'array',
          content: {
            kind: 'object',
            content: {
              checkType: {
                kind: 'constant',
                content: [
                  'similar_writing',
                  'different_categories',
                  'less_than_two_characters',
                  'missing_bank_account',
                  'missing_cadatre',
                  'incorrect_metadata',
                  'other_checklist',
                ] as const,
              },
              message: { kind: 'primitive', content: 'string' },
              entities: {
                kind: 'array',
                content: {
                  kind: 'object',
                  content: {
                    text: { kind: 'primitive', content: 'string' },
                    start: { kind: 'primitive', content: 'number' },
                    label: { kind: 'primitive', content: 'string' },
                    source: { kind: 'primitive', content: 'string' },
                    score: { kind: 'primitive', content: 'number' },
                    entityId: { kind: 'primitive', content: 'string' },
                    end: { kind: 'primitive', content: 'number' },
                  },
                },
              },
              sentences: {
                kind: 'or',
                content: [
                  {
                    kind: 'array',
                    content: {
                      kind: 'object',
                      content: {
                        start: { kind: 'primitive', content: 'number' },
                        end: { kind: 'primitive', content: 'number' },
                      },
                    },
                  },
                  { kind: 'primitive', content: 'undefined' },
                ],
              },
              metadata_text: {
                kind: 'or',
                content: [
                  { kind: 'array', content: { kind: 'primitive', content: 'string' } },
                  { kind: 'primitive', content: 'undefined' },
                ],
              },
            },
          },
        },
      ],
    },
    documentId: { kind: 'custom', content: 'id' },
    _id: { kind: 'custom', content: 'id' },
  },
} as const);

type annotationReportType = buildType<typeof annotationReportModel, { id: idType }>;
