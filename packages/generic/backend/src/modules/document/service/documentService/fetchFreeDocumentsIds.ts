import { buildDocumentRepository } from '../../repository';

export { fetchFreeDocumentsIds };

async function fetchFreeDocumentsIds() {
  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAllByStatus(['free']);
  return documents.map(({ _id }) => _id);
}
