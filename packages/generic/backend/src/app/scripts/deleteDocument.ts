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
  logger.log(`deleteDocument`);
  const documentRepository = buildDocumentRepository();
  const document = await documentRepository.findOneByDocumentNumberAndSource({
    documentNumber,
    source,
  });

  document && (await documentService.deleteDocument(document._id));

  logger.log(`DONE deleteDocument`);
}
