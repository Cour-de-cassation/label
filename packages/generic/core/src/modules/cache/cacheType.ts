import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { cacheModel };

export type { cacheType };

const cacheModel = buildModel({
  kind: 'object',
  content: {
    _id: { kind: 'custom', content: 'id' },
    key: { kind: 'primitive', content: 'string' },
    updateDate: { kind: 'primitive', content: 'number' },
    content: { kind: 'primitive', content: 'string' },
  },
} as const);

type cacheType = buildType<typeof cacheModel, { id: idType; key: string; updateDate: number; content: string }>;
