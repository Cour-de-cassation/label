import { buildDocumentRepository } from '../../repository';

export { fetchAllRoutes };

async function fetchAllRoutes() {
  const documentRepository = buildDocumentRepository();

  return documentRepository.distinct('route');
}
