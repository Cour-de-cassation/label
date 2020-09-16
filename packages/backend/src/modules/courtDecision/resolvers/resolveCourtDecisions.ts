import { buildCourtDecisionRepository } from '../repository';

export { resolveCourtDecisions };

async function resolveCourtDecisions() {
  const courtDecisionRepository = buildCourtDecisionRepository();
  const courtDecisions = courtDecisionRepository.findAll();
  return courtDecisions;
}
