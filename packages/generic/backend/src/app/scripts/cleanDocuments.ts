import { documentType, idModule, treatmentModule } from '@label/core';
import { assignationService } from '../../modules/assignation';
import {
  buildDocumentRepository,
  documentService,
} from '../../modules/document';
import { treatmentService } from '../../modules/treatment';
import { logger } from '../../utils';
import { freePendingDocuments } from './freePendingDocuments';

export { cleanDocuments };

async function cleanDocuments() {
  logger.log(`cleanDocuments`);

  await cleanLoadedDocuments();

  await cleanFreeDocuments();

  await cleanTreatments();
}

async function cleanLoadedDocuments() {
  logger.log(`cleanLoadedDocuments`);

  const documentRepository = buildDocumentRepository();

  logger.log('Fetching "nlpAnnotating" documents');
  const nlpAnnotatingDocuments = await documentRepository.findAllByStatusProjection(
    ['nlpAnnotating'],
    ['_id'],
  );
  logger.log(`${nlpAnnotatingDocuments.length} documents found`);

  await documentRepository.updateMany(
    { status: 'nlpAnnotating' },
    { status: 'loaded' },
  );

  logger.log(`"nlpAnnotating" documents status set to "loaded"`);
  logger.log(`Fetching "loaded" documents`);

  const loadedDocuments = await documentRepository.findAllByStatusProjection(
    ['loaded'],
    ['_id'],
  );
  logger.log(`${loadedDocuments.length} documents found`);

  const loadedDocumentsIds = loadedDocuments.map(({ _id }) => _id);

  for (let i = 0, length = loadedDocumentsIds.length; i < length; i++) {
    logger.log(
      `Deleting assignations, their treatments and all treatments : ${
        i + 1 / length
      }`,
    );
    await assignationService.deleteAssignationsByDocumentId(
      loadedDocumentsIds[i],
    );
    await treatmentService.deleteTreatmentsByDocumentId(loadedDocumentsIds[i]);
  }

  logger.log('Done');
}

async function cleanFreeDocuments() {
  logger.log(`cleanFreeDocuments`);

  await freePendingDocuments();

  const documentRepository = buildDocumentRepository();

  logger.log(
    `Deleting assignations and their treatments for free documents - should not happen`,
  );
  const freeDocuments = await documentRepository.findAllProjection(['_id']);

  const freeDocumentIds = freeDocuments.map(({ _id }) => _id);
  for (let i = 0, length = freeDocumentIds.length; i < length; i++) {
    logger.log(
      `Deleting assignations and their treatments : ${i + 1 / length}`,
    );
    await assignationService.deleteAssignationsByDocumentId(freeDocumentIds[i]);
  }

  logger.log('Done');
}

async function cleanTreatments() {
  logger.log(`cleanTreatments`);
  const documentRepository = buildDocumentRepository();
  const documents = await documentRepository.findAllByStatusProjection(
    ['loaded', 'nlpAnnotating', 'free', 'pending', 'saved'],
    ['_id'],
  );
  logger.log(`Cleaning ${documents.length} documents`);
  const documentIds = documents.map(({ _id }) => _id);
  for (let i = 0, length = documents.length; i < length; i++) {
    logger.log(`Cleaning document n°${i + 1}/${length}`);
    try {
      const treatments = await treatmentService.fetchTreatmentsByDocumentId(
        documentIds[i],
      );
      treatmentModule.lib.computeAnnotations(treatments);
    } catch (error) {
      logger.log(`Error while computing annotations`);
      await cleanDocument(documentIds[i]);
    }
  }
  logger.log('cleanDocuments done!');
}

async function cleanDocument(documentId: documentType['_id']) {
  logger.log(`Cleaning document ${idModule.lib.convertToString(documentId)}`);

  logger.log('Deleting assignations');
  await assignationService.deleteAssignationsByDocumentId(documentId);
  logger.log('Deleting treatments');

  await treatmentService.deleteTreatmentsByDocumentId(documentId);
  logger.log('Setting status to loaded');

  await documentService.updateDocumentStatus(documentId, 'loaded');
}
