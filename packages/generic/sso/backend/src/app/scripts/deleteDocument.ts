import { logger } from '../../utils';
import {
  buildDocumentRepository,
  documentService,
} from '../../modules/document';
import { documentType } from '@label/core';

export { deleteDocument };

async function deleteDocument(
  documentNumber: documentType['documentNumber'],
  source: documentType['source'],
) {
  logger.log({ operationName: 'deleteDocument', msg: 'START' });
  const documentRepository = buildDocumentRepository();
  const document = await documentRepository.findOneByDocumentNumberAndSource({
    documentNumber,
    source,
  });

  document && (await documentService.deleteDocument(document._id));

  logger.log({ operationName: 'deleteDocument', msg: 'DONE' });
}
