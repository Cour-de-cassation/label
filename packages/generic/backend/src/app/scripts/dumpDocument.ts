import { logger } from '../../utils';
import { buildDocumentRepository } from '../../modules/document';
import { documentType } from '@label/core';

export { dumpDocument };

async function dumpDocument(
  documentNumber: documentType['documentNumber'],
  source: documentType['source'],
) {
  logger.log(`dumpDocument`);
  const documentRepository = buildDocumentRepository();
  const document = await documentRepository.findOneByDocumentNumberAndSource({
    documentNumber,
    source,
  });

  logger.log(document);
  logger.log(`DONE dumpDocument`);
}
