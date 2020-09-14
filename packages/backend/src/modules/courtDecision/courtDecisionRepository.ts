import { courtDecisionType } from '@label/core';
import { mongoDbType } from '../../lib/mongo';


export { buildCourtDecisionRepository };

function buildCourtDecisionRepository(db: mongoDbType) {
  const collection = db.collection('courtDecisions');

  return {
    create,
    findAll,
  }

  async function create(courtDecision: Partial<courtDecisionType>) {
    const insertResult = await collection.insertOne(courtDecision);
    return { success: !!insertResult.result.ok }
  }

  async function findAll() {
    const courtDecisions = await collection.find().toArray();
    return courtDecisions;
  }
}
