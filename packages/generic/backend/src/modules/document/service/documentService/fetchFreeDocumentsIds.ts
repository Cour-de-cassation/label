import { buildDocumentRepository } from '../../repository';

export { fetchFreeDocumentsIds };

async function fetchFreeDocumentsIds() {
  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAllByStatusProjection(
    ['free'],
    ['_id'],
  );
  return documents.map(({ _id }) => _id);
}
