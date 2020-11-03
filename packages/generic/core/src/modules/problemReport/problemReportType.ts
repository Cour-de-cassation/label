import { dataModelType, typeOfDataModel } from '../dataModelType';

export { problemReportDataModel };

export type { problemReportType };

const problemReportDataModel = {
  assignationId: { type: 'id', graphQL: true },
  _id: { type: 'id', graphQL: true },
  text: { type: 'string', graphQL: true },
  type: { type: ['bug', 'annotationProblem', 'suggestion'], graphQL: true },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: dataModelType = problemReportDataModel;

type problemReportType = typeOfDataModel<typeof problemReportDataModel>;
