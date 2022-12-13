import { buildDocumentRepository } from '../../repository';

export { countPendingDocuments };

async function countPendingDocuments() {
  const documentRepository = buildDocumentRepository();
  return documentRepository.countByStatus(['pending']);
}
