import { buildDocumentRepository } from '../../repository';

export { countDoneDocuments };

async function countDoneDocuments() {
  const documentRepository = buildDocumentRepository();
  return documentRepository.countByStatus(['done', 'toBePublished']);
}
