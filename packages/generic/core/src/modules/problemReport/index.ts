import { problemReportGenerator } from './generator';
import { problemReportModel, problemReportType } from './problemReportType';
import { buildProblemReport } from './lib';

export { problemReportModule };

export type { problemReportType };

const problemReportModule = {
  model: problemReportModel,
  generator: problemReportGenerator,
  lib: { buildProblemReport },
};
