import { buildDocumentRepository } from '../../repository';

export { resolveCourtDecisions };

async function resolveCourtDecisions() {
  const courtDecisionRepository = buildDocumentRepository();
  const courtDecisions = courtDecisionRepository.findAll();
  return courtDecisions;
}
