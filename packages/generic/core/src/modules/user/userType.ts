import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { userModel };

export type { userType };

const userModel = buildModel({
  kind: 'object',
  content: {
    _id: { kind: 'custom', content: 'id' },
    deletionDate: {
      kind: 'or',
      content: [
        { kind: 'primitive', content: 'number' },
        { kind: 'primitive', content: 'undefined' },
      ],
    },
    email: { kind: 'primitive', content: 'string' },
    hashedPassword: { kind: 'primitive', content: 'string' },
    isActivated: { kind: 'primitive', content: 'boolean' },
    name: { kind: 'primitive', content: 'string' },
    role: {
      kind: 'constant',
      content: ['admin', 'annotator', 'publicator'] as const,
    },
  },
} as const);

type userType = buildType<typeof userModel, { id: idType }>;
