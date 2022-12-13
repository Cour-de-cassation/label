import { buildDocumentRepository } from '../../repository';

export { countLockedDocuments };

async function countLockedDocuments() {
  const documentRepository = buildDocumentRepository();
  return documentRepository.countByStatus(['locked']);
}
