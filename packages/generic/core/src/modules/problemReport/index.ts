import { problemReportGenerator } from './generator';
import { problemReportDataModel, problemReportType } from './problemReportType';
import { buildProblemReport } from './lib';

export { problemReportModule };

export type { problemReportType };

const problemReportModule = {
  dataModel: problemReportDataModel,
  generator: problemReportGenerator,
  lib: { buildProblemReport },
};
