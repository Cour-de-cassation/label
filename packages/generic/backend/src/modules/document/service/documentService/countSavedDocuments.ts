import { buildDocumentRepository } from '../../repository';

export { countSavedDocuments };

async function countSavedDocuments() {
  const documentRepository = buildDocumentRepository();
  return documentRepository.countByStatus(['saved']);
}
