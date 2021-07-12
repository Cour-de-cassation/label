import { dateBuilder, documentType } from '@label/core';
import { buildDocumentRepository } from '../../modules/document';
import { logger } from '../../utils';
import { connectorConfigType } from './connectorConfigType';

export { buildConnector };

function buildConnector(connectorConfig: connectorConfigType) {
  return {
    async importNewDocuments(documentCount: number) {
      const DAYS_INTERVAL = 100;
      logger.log(`importNewDocuments: ${documentCount}`);

      logger.log(`Fetching ${connectorConfig.name} documents...`);
      let daysAgo = 0;
      const newDocuments: documentType[] = [];
      while (newDocuments.length < documentCount) {
        const newCourtDecisions = await connectorConfig.fetchAllCourtDecisionsBetween(
          {
            startDate: new Date(dateBuilder.daysAgo(daysAgo + DAYS_INTERVAL)),
            endDate: new Date(dateBuilder.daysAgo(daysAgo)),
          },
        );
        logger.log(
          `${newCourtDecisions.length} ${connectorConfig.name} court decisions fetched!`,
        );
        const documents = newCourtDecisions.map(
          connectorConfig.mapCourtDecisionToDocument,
        );
        newDocuments.push(...documents);
        daysAgo += DAYS_INTERVAL;
      }

      logger.log(
        `Insertion ${newDocuments.length} documents into the database...`,
      );
      await insertDocuments(newDocuments);
      logger.log(`Insertion done!`);

      logger.log(`Send documents have been loaded...`);
      await connectorConfig.updateDocumentsLoadedStatus(newDocuments);
      logger.log(`DONE`);
    },

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
    async deleteJuricaDocumentsFromLabelDb() {
      const documentRepository = buildDocumentRepository();
      const freeDocuments = await documentRepository.findAllByStatus(['free']);
      const freeJuricaDocuments = freeDocuments.filter(
        (document) => document.source === 'jurica',
      );
      await connectorConfig.updateDocumentsToBeTreatedStatus(
        freeJuricaDocuments,
      );
      await documentRepository.deleteManyByIds(
        freeJuricaDocuments.map(({ _id }) => _id),
      );
    },
  };
}

async function insertDocuments(documents: documentType[]) {
  const documentRepository = buildDocumentRepository();

  for await (const document of documents) {
    await documentRepository.insert(document);
  }
}
