import { buildDocumentRepository } from '../../repository';

export { fetchAllSources };

async function fetchAllSources() {
  const documentRepository = buildDocumentRepository();

  return documentRepository.distinct('source');
}
