import { courtDecisionType } from '@label/core';
import { mongo } from '../../../lib/mongo';
import { courtDecisionRepositoryType } from './courtDecisionRepositoryType';

export { buildCourtDecisionRepository };

function buildCourtDecisionRepository(): courtDecisionRepositoryType {
  const db = mongo.getDb();
  const collection = db.collection('courtDecisions');

  return {
    findAll,
    insert,
  };

  async function findAll() {
    const courtDecisions = await collection.find().toArray();
    return courtDecisions;
  }

  async function insert(courtDecision: courtDecisionType) {
    const insertResult = await collection.insertOne(courtDecision);
    return { success: !!insertResult.result.ok };
  }
}
