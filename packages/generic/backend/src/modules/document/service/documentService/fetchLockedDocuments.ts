import { buildDocumentRepository } from '../../repository';

export { fetchLockedDocuments };

async function fetchLockedDocuments() {
  const documentRepository = buildDocumentRepository();
  return documentRepository.findAllByStatus(['locked']);
}
