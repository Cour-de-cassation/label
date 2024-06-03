import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { preAssignationModel };

export type { preAssignationType };

const preAssignationModel = buildModel({
  kind: 'object',
  content: {
    _id: { kind: 'custom', content: 'id' },
    userId: { kind: 'custom', content: 'id' },
    number: { kind: 'primitive', content: 'string' },
    source: { kind: 'primitive', content: 'string' },
    creationDate: { kind: 'primitive', content: 'number' },
  },
} as const);

type preAssignationType = buildType<typeof preAssignationModel, { id: idType }>;
