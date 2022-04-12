import { buildDocumentRepository } from '../../modules/document';
import { logger } from '../../utils';

export { listAllDocuments };

async function listAllDocuments() {
  logger.log(`listAllDocuments`);

  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();
  logger.log(`${documents.length} documents found`);
  for (let index = 0; index < documents.length; index++) {
    const document = documents[index];
    logger.log(
      `${index + 1} | ${document['_id']} | ${document['source']} | ${
        document['documentNumber']
      } | ${document['status']} | ${document['creationDate']}`,
    );
  }

  logger.log('Done');
}
