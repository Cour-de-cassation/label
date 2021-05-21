import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { migrationModel };

export type { migrationType };

const migrationModel = buildModel({
  kind: 'object',
  content: {
    _id: { kind: 'custom', content: 'id' },
    creationDate: { kind: 'primitive', content: 'number' },
    order: { kind: 'primitive', content: 'number' },
  },
} as const);

type migrationType = buildType<typeof migrationModel, { id: idType }>;
