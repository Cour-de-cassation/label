import { buildDocumentRepository } from '../../modules/document';
import { logger } from '../../utils';

export { listAllDocuments };

async function listAllDocuments() {
  logger.log({ operationName: 'listAllDocuments', msg: 'START' });

  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();
  logger.log({
    operationName: 'listAllDocuments',
    msg: `${documents.length} documents found`,
  });
  for (let index = 0; index < documents.length; index++) {
    const document = documents[index];
    logger.log({
      operationName: 'listAllDocuments',
      msg: `${index + 1} | ${document['_id']} | ${document['source']} | ${
        document['documentNumber']
      } | ${document['status']} | ${document['creationDate']}`,
    });
  }

  logger.log({ operationName: 'listAllDocuments', msg: 'DONE' });
}
