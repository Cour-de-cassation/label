import { buildDocumentRepository } from '../../repository';

export { fetchDoneDocuments };

async function fetchDoneDocuments() {
  const documentRepository = buildDocumentRepository();

  return documentRepository.findAllByStatus(['done', 'toBePublished']);
}
