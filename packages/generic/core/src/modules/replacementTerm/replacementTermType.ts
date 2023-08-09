import { buildModel, buildType } from '../modelType';

export { replacementTermModel };

export type { replacementTermType };

const replacementTermModel = buildModel({
  kind: 'object',
  content: {
    annotationId: { kind: 'primitive', content: 'string' },
    replacementText: { kind: 'primitive', content: 'string' },
  },
} as const);

type replacementTermType = buildType<typeof replacementTermModel>;
