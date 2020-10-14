import { buildDocumentRepository } from '../../repository';

export { resolveDocument };

async function resolveDocument() {
  const documentRepository = buildDocumentRepository();
  const documents = await documentRepository.findAll();
  return documents[0];
}
