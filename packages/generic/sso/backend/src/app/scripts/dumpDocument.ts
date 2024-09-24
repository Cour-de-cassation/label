import { logger } from '../../utils';
import { buildDocumentRepository } from '../../modules/document';
import { documentType } from '@label/core';

export { dumpDocument };

async function dumpDocument(
  documentNumber: documentType['documentNumber'],
  source: documentType['source'],
) {
  logger.log({ operationName: 'dumpDocument', msg: 'START' });
  const documentRepository = buildDocumentRepository();
  const document = await documentRepository.findOneByDocumentNumberAndSource({
    documentNumber,
    source,
  });

  logger.log({
    operationName: 'dumpDocument',
    msg: 'Document:',
    data: document,
  });
  logger.log({ operationName: 'dumpDocument', msg: 'DONE' });
}
