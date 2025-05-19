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
    score: { kind: 'primitive', content: 'number' },
    source: { kind: 'primitive', content: 'string' },
  },
} as const);

type annotationType = buildType<typeof annotationModel>;
