import { buildDocumentRepository } from '../../repository';

export { resolveDocuments };

async function resolveDocuments() {
  const documentRepository = buildDocumentRepository();
  return documentRepository.findAll();
}
