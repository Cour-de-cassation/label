import { documentType } from '@label/core';
import { buildDocumentRepository } from '../../modules/document';
import { logger } from '../../utils';
import { connectorType } from './connectorType';

export { connectorSynchronizer };

const connectorSynchronizer = {
  async synchronizeFromConnector(connector: connectorType) {
    logger.log(`Fetching ${connector.name} documents...`);
    const documents = await connector.fetchAllDocuments();
    logger.log(`${documents.length} ${connector.name} documents fetched!`);

    logger.log(`Insertion into the database...`);
    await insertDocuments(documents);
    logger.log(`Insertion done!`);
  },
};

async function insertDocuments(documents: documentType[]) {
  const documentRepository = buildDocumentRepository();

  for await (const document of documents) {
    await documentRepository.insert(document);
  }
}
