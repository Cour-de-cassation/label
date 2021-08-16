import { dateBuilder, documentType, idModule, timeOperator } from '@label/core';
import {
  buildDocumentRepository,
  documentService,
} from '../../modules/document';
import { logger } from '../../utils';
import { connectorConfigType } from './connectorConfigType';

export { buildConnector };

function buildConnector(connectorConfig: connectorConfigType) {
  return {
    async importSpecificDocument({
      documentNumber,
      source,
    }: {
      documentNumber: number;
      source: string;
    }) {
      logger.log(`importSpecificDocument: ${documentNumber} - ${source}`);

      const courtDecision = await connectorConfig.fetchCourtDecisionBySourceIdAndSourceName(
        { sourceId: documentNumber, sourceName: source },
      );

      if (!courtDecision) {
        logger.log(
          `No court decision found for specified documentNumber and source`,
        );
        return;
      }

      logger.log(
        `Court decision found. labelStatus: ${courtDecision.labelStatus}, ${
          !!courtDecision.pseudoText ? 'already' : 'never'
        } pseudonymised`,
      );
      const document = connectorConfig.mapCourtDecisionToDocument(
        courtDecision,
      );
      logger.log(
        `Court decision converted. Inserting document into database...`,
      );
      await insertDocument(document);
      logger.log(`Insertion done`);

      logger.log(`Send document has been loaded...`);
      await connectorConfig.updateDocumentsLoadedStatus([document]);
      logger.log(`DONE`);
    },

    async importNewDocuments(documentCount: number) {
      const DAYS_INTERVAL = 100;
      logger.log(`importNewDocuments: ${documentCount}`);

      logger.log(`Fetching ${connectorConfig.name} documents...`);
      let daysAgo = 0;
      const newDocuments: documentType[] = [];
      while (newDocuments.length < documentCount) {
        const startDate = new Date(
          dateBuilder.daysAgo(daysAgo + DAYS_INTERVAL),
        );
        const endDate = new Date(dateBuilder.daysAgo(daysAgo));
        const newCourtDecisions = await connectorConfig.fetchAllCourtDecisionsBetween(
          {
            startDate,
            endDate,
          },
        );
        logger.log(
          `${newCourtDecisions.length} ${
            connectorConfig.name
          } court decisions fetched between ${timeOperator.convertTimestampToReadableDate(
            startDate.getTime(),
          )} and ${timeOperator.convertTimestampToReadableDate(
            endDate.getTime(),
          )}!`,
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

    async resetAllDocumentsSince(days: number) {
      const documentRepository = buildDocumentRepository();

      const documents = await documentRepository.findAll();
      logger.log(
        `Found ${documents.length} in the DB. Filtering the documents to reset...`,
      );

      const documentsToReset = documents.filter(
        (document) =>
          document.creationDate >= dateBuilder.daysAgo(days) &&
          document.status !== 'done' &&
          document.status !== 'toBePublished',
      );
      logger.log(
        `Found ${documentsToReset.length} in the DB. Updating their status to toBeTreated in SDER DB...`,
      );

      await connectorConfig.updateDocumentsToBeTreatedStatus(documentsToReset);
      logger.log(
        'Documents status updated! Deleting the documents in the Database...',
      );

      for (let i = 0, l = documentsToReset.length; i < l; i++) {
        try {
          const documentIdToReset = documentsToReset[i]._id;
          logger.log(
            `Deleting document ${idModule.lib.convertToString(
              documentIdToReset,
            )}: ${i + 1}/${l}...`,
          );
          await documentService.deleteDocument(documentIdToReset);
        } catch (error) {
          logger.error(`An error happened while deleting the document`);
        }
      }
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

function insertDocument(document: documentType) {
  const documentRepository = buildDocumentRepository();

  return documentRepository.insert(document);
}
