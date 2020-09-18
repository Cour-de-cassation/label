import { nlpReportType } from '@label/core';

export { nlpReportRepositoryType };

type nlpReportRepositoryType = {
  insert: (annotation: nlpReportType) => Promise<{ success: boolean }>;
};
