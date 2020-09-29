import { documentType } from '@label/core';
import { buildDocumentRepository } from '../../modules/document';
import { logger } from '../../utils';
import { connectorConfigType } from './connectorConfigType';

export { buildConnector };

function buildConnector(connectorConfig: connectorConfigType) {
  return {
    async importAllDocuments() {
      logger.log(`Fetching ${connectorConfig.name} documents...`);
      const documents = await connectorConfig.fetchAllDocuments();
      logger.log(
        `${documents.length} ${connectorConfig.name} documents fetched!`,
      );

      logger.log(`Insertion into the database...`);
      await insertDocuments(documents);
      logger.log(`Insertion done!`);
    },
  };
}

async function insertDocuments(documents: documentType[]) {
  const documentRepository = buildDocumentRepository();

  for await (const document of documents) {
    await documentRepository.insert(document);
  }
}
