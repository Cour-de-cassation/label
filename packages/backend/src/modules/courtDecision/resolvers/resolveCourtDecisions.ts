import { mongo } from '../../../lib/mongo'
import { buildCourtDecisionRepository } from '../courtDecisionRepository';

export { resolveCourtDecisions }

async function resolveCourtDecisions() {
  const db = mongo.getDb();
  const courtDecisionRepository = buildCourtDecisionRepository(db)
  const courtDecisions = courtDecisionRepository.findAll();
  return courtDecisions;
};
