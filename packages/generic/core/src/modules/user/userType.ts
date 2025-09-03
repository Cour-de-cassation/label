import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { userModel };

export type { userType };

const userModel = buildModel({
  kind: 'object',
  content: {
    _id: { kind: 'custom', content: 'id' },
    email: { kind: 'primitive', content: 'string' },
    name: { kind: 'primitive', content: 'string' },
    role: {
      kind: 'constant',
      content: ['admin', 'annotator', 'publicator', 'scrutator'] as const,
    },
  },
} as const);

type userType = buildType<typeof userModel, { id: idType }>;
