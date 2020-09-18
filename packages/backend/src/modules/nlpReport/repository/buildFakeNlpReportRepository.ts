import { nlpReportType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../tests';
import { nlpReportRepositoryType } from './nlpReportRepositoryType';

export { buildFakeNlpReportRepository };

const buildFakeNlpReportRepository = buildFakeRepositoryBuilder<
  nlpReportType,
  nlpReportRepositoryType
>(collection => {
  return {
    insert,
  };

  async function insert(nlpReport: nlpReportType) {
    collection.push(nlpReport);
    return { success: true };
  }
});
