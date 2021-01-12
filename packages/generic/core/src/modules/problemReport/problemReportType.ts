import { buildDataModelEntry, typeOfDataModel } from '../dataModelType';

export { problemReportDataModel };

export type { problemReportType };

const problemReportDataModel = {
  assignationId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), graphQL: true },
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), graphQL: true },
  text: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), graphQL: true },
  type: {
    type: buildDataModelEntry({ kind: 'constant', content: ['bug', 'annotationProblem', 'suggestion'] as const }),
    graphQL: true,
  },
} as const;

type problemReportType = typeOfDataModel<typeof problemReportDataModel>;
