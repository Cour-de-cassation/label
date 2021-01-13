import { buildDataModelEntry, typeOfDataModel } from '../dataModelType';

export { problemReportDataModel };

export type { problemReportType };

const problemReportDataModel = {
  assignationId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  text: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: true },
  type: {
    type: buildDataModelEntry({ kind: 'constant', content: ['bug', 'annotationProblem', 'suggestion'] as const }),
    network: true,
  },
} as const;

type problemReportType = typeOfDataModel<typeof problemReportDataModel>;
