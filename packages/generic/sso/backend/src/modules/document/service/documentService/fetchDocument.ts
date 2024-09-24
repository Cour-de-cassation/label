import { documentType } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { fetchDocument };

async function fetchDocument(documentId: documentType['_id']) {
  const documentRepository = buildDocumentRepository();

  return documentRepository.findById(documentId);
}
