import { buildDocumentRepository } from '../../repository';

export { countRejectedDocuments };

async function countRejectedDocuments() {
  const documentRepository = buildDocumentRepository();
  return documentRepository.countByStatus(['rejected']);
}
