import { flatten } from 'lodash';
import { documentType } from '@label/core';
import { buildDocumentRepository } from '../../modules/document';
import { logger } from '../../utils';
import { connectorConfigType } from './connectorConfigType';

export { buildConnector };

function buildConnector(connectorConfig: connectorConfigType) {
  return {
    async importAllDocumentsSince(days: number) {
      logger.log(`importAllDocumentsSince ${days}`);

      logger.log(`Fetching ${connectorConfig.name} documents...`);
      const newCourtDecisions = await connectorConfig.fetchAllCourtDecisionsSince(
        days,
      );
      logger.log(
        `${newCourtDecisions.length} ${connectorConfig.name} court decisions fetched!`,
      );
      const newDocuments = newCourtDecisions.map(
        connectorConfig.mapCourtDecisionToDocument,
      );
      const boundDecisionsDocumentNumbers = newDocuments.map(
        ({ decisionMetadata }) => decisionMetadata.boundDecisionDocumentNumbers,
      );
      logger.log(
        `Fetching ${boundDecisionsDocumentNumbers.length} bound documents...`,
      );
      const boundDocuments = await connectorConfig.fetchBoundDocumentsBySourceIds(
        flatten(boundDecisionsDocumentNumbers),
      );
      const priorizedBoundDocuments = boundDocuments.map((document) => ({
        ...document,
        priority: 'medium' as const,
      }));
      logger.log(
        `${priorizedBoundDocuments.length} ${connectorConfig.name} bound court decisions fetched!`,
      );
      const documents = [...newDocuments, ...priorizedBoundDocuments];
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
