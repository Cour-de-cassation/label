import { passwordTimeValidityStatus } from 'sder-core';
import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { userModel, passwordTimeValidityStatusModel };

export type { userType, passwordTimeValidityStatusType };

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
    passwordLastUpdateDate: { kind: 'primitive', content: 'number' },
    role: {
      kind: 'constant',
      content: ['admin', 'annotator', 'publicator', 'scrutator'] as const,
    },
  },
} as const);

const passwordTimeValidityStatusModel = buildModel({ kind: 'constant', content: passwordTimeValidityStatus });

type userType = buildType<typeof userModel, { id: idType }>;
type passwordTimeValidityStatusType = buildType<typeof passwordTimeValidityStatusModel>;
