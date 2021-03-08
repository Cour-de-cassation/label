import { buildDataModelEntry, networkTypeOfDataModel } from '../dataModelType';

export { annotationReportDataModel };

export type { annotationReportType };

const annotationReportDataModel = {
  checkList: {
    type: buildDataModelEntry({ kind: 'list', content: { kind: 'primitive', content: 'string' } }),
    network: true,
  },
  documentId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
} as const;

type annotationReportType = networkTypeOfDataModel<typeof annotationReportDataModel>;
