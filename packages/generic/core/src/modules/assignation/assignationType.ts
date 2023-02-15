import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { assignationModel };

export type { assignationType };

const assignationModel = buildModel({
  kind: 'object',
  content: {
    _id: { kind: 'custom', content: 'id' },
    documentId: { kind: 'custom', content: 'id' },
    treatmentId: { kind: 'custom', content: 'id' },
    userId: { kind: 'custom', content: 'id' },
    assignationDate: { kind: 'custom', content: 'number' },
  },
} as const);

type assignationType = buildType<typeof assignationModel, { id: idType }>;
