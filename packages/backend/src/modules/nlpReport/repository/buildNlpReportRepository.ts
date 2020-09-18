import { nlpReportType } from '@label/core';
import { mongo } from '../../../lib/mongo';
import { nlpReportRepositoryType } from './nlpReportRepositoryType';

export { buildNlpReportRepository };

function buildNlpReportRepository(): nlpReportRepositoryType {
  const db = mongo.getDb();
  const collection = db.collection('nlpReports');

  return {
    insert,
  };

  async function insert(nlpReport: nlpReportType) {
    const insertResult = await collection.insertOne(nlpReport);
    return { success: !!insertResult.result.ok };
  }
}
