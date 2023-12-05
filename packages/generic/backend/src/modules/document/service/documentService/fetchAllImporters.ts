import { buildDocumentRepository } from '../../repository';

export { fetchAllImporters };

async function fetchAllImporters() {
  const documentRepository = buildDocumentRepository();

  return documentRepository.distinct('importer');
}
