import { buildModel, buildType } from '../modelType';

export { annotationModel };

export type { annotationType };

const annotationModel = buildModel({
  kind: 'object',
  content: {
    category: { kind: 'primitive', content: 'string' },
    entityId: { kind: 'primitive', content: 'string' },
    start: { kind: 'primitive', content: 'number' },
    text: { kind: 'primitive', content: 'string' },
    certaintyScore: {
      kind: 'or',
      content: [
        { kind: 'primitive', content: 'number' },
        { kind: 'primitive', content: 'undefined' },
      ],
    },
  },
} as const);

type annotationType = buildType<typeof annotationModel>;
