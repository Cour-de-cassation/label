import { buildDocumentRepository } from '../../repository';

export { countFreeDocuments };

async function countFreeDocuments() {
  const documentRepository = buildDocumentRepository();
  return documentRepository.countByStatus(['free']);
}
