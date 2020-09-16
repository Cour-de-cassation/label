import { courtDecisionType } from '@label/core';
import { mongo } from '../../../lib/mongo';

export { buildCourtDecisionRepository };

function buildCourtDecisionRepository() {
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

  async function insert(courtDecision: Partial<courtDecisionType>) {
    const insertResult = await collection.insertOne(courtDecision);
    return { success: !!insertResult.result.ok };
  }
}
