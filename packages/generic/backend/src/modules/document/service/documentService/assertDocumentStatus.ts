import { errorHandlers } from 'sder';
import { documentType } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { assertDocumentStatus };

async function assertDocumentStatus({
  documentId,
  status,
}: {
  documentId: documentType['_id'];
  status: documentType['status'];
}) {
  const documentRepository = buildDocumentRepository();

  const document = await documentRepository.findById(documentId);
  if (document.status !== status) {
    throw errorHandlers.serverErrorHandler.build(
      `The document status "${document.status}" does not match the following: "${status}"`,
    );
  }

  return true;
}
