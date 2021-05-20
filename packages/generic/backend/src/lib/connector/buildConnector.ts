import { documentType } from '@label/core';
import { buildDocumentRepository } from '../../modules/document';
import { dateBuilder, logger } from '../../utils';
import { connectorConfigType } from './connectorConfigType';

export { buildConnector };

function buildConnector(connectorConfig: connectorConfigType) {
  return {
    async importDocumentsSince(days: number) {
      logger.log(`importAllDocumentsSince ${days}`);

      logger.log(`Fetching ${connectorConfig.name} documents...`);
      const newCourtDecisions = await connectorConfig.fetchAllCourtDecisionsBetween(
        {
          startDate: new Date(dateBuilder.daysAgo(days)),
          endDate: new Date(),
        },
      );
      logger.log(
        `${newCourtDecisions.length} ${connectorConfig.name} court decisions fetched!`,
      );
      const documents = newCourtDecisions.map(
        connectorConfig.mapCourtDecisionToDocument,
      );

      logger.log(
        `Insertion ${documents.length} documents into the database...`,
      );
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
