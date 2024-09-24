import { problemReportType } from '@label/core';

export type { customProblemReportRepositoryType };

type customProblemReportRepositoryType = {
  deleteByDocumentId: (
    documentId: problemReportType['documentId'],
  ) => Promise<void>;
};
