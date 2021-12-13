import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { problemReportModel };

export type { problemReportType };

const problemReportModel = buildModel({
  kind: 'object',
  content: {
    _id: { kind: 'custom', content: 'id' },
    documentId: { kind: 'custom', content: 'id' },
    userId: { kind: 'custom', content: 'id' },
    date: { kind: 'primitive', content: 'number' },
    text: { kind: 'primitive', content: 'string' },
    hasBeenRead: { kind: 'primitive', content: 'boolean' },
    type: { kind: 'constant', content: ['bug', 'annotationProblem', 'suggestion'] as const },
  },
} as const);

type problemReportType = buildType<typeof problemReportModel, { id: idType }>;
