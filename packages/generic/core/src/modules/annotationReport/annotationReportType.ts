import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { annotationReportModel };

export type { annotationReportType };

const annotationReportModel = buildModel({
  kind: 'object',
  content: {
    checkList: { kind: 'array', content: { kind: 'primitive', content: 'string' } },
    documentId: { kind: 'custom', content: 'id' },
    _id: { kind: 'custom', content: 'id' },
  },
} as const);

type annotationReportType = buildType<typeof annotationReportModel, { id: idType }>;
