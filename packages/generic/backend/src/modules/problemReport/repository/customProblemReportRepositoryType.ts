import { problemReportType } from '@label/core';

export type { customProblemReportRepositoryType };

type customProblemReportRepositoryType = {
  deleteByAssignationId: (
    assignationId: problemReportType['assignationId'],
  ) => Promise<void>;
};
