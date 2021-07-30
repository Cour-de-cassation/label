import { buildDocumentRepository } from '../../repository';

export { fetchAllPublicationCategories };

async function fetchAllPublicationCategories() {
  const documentRepository = buildDocumentRepository();

  return documentRepository.findAllPublicationCategories();
}
