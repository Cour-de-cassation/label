import { buildDocumentRepository } from '../../repository';

export { fetchRejectedDocuments };

async function fetchRejectedDocuments() {
  const documentRepository = buildDocumentRepository();
  return documentRepository.findAllByStatus(['rejected']);
}
