import { buildDocumentRepository } from '../../repository';

export { countLoadedDocuments };

async function countLoadedDocuments() {
  const documentRepository = buildDocumentRepository();
  return documentRepository.countByStatus(['loaded']);
}
