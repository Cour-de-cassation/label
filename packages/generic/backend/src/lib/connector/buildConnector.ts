import { documentType } from '@label/core';
import { buildDocumentRepository } from '../../modules/document';
import { logger } from '../../utils';
import { connectorConfigType } from './connectorConfigType';

export { buildConnector };

function buildConnector(connectorConfig: connectorConfigType) {
  return {
    async importAllDocumentsSince(days: number) {
      logger.log(`Fetching ${connectorConfig.name} documents...`);
      const documents = await connectorConfig.fetchAllDocumentsSince(days);
      logger.log(
        `${documents.length} ${connectorConfig.name} documents fetched!`,
      );

      logger.log(`Insertion into the database...`);
      await insertDocuments(documents);
      logger.log(`Insertion done!`);

      logger.log(`Send documents have been loaded...`);
      await connectorConfig.updateDocumentsLoadedStatus(documents);
      logger.log(`DONE`);
    },
  };
}

async function insertDocuments(documents: documentType[]) {
  const documentRepository = buildDocumentRepository();

  for await (const document of documents) {
    await documentRepository.insert(document);
  }
}
