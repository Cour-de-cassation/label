import { documentType, idModule, treatmentModule } from '@label/core';
import { buildAssignationRepository } from '../../modules/assignation/repository/buildAssignationRepository';
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

  await cleanAssignedDocuments();

  await cleanFreeDocuments();

  await cleanTreatments();

  await cleanAssignations();
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
        i + 1
      }/${length}`,
    );
    await assignationService.deleteAssignationsByDocumentId(
      loadedDocumentsIds[i],
    );
    await treatmentService.deleteTreatmentsByDocumentId(loadedDocumentsIds[i]);
  }

  logger.log('Done');
}

async function cleanAssignedDocuments() {
  logger.log(`cleanAssignedDocuments`);
  const documentRepository = buildDocumentRepository();
  const documents = await documentRepository.findAllByStatusProjection(
    ['pending', 'saved', 'rejected', 'toBePublished', 'done'],
    ['_id', 'status'],
  );

  const assignationRepository = buildAssignationRepository();
  const assignations = await assignationRepository.findAllProjection([
    '_id',
    'documentId',
  ]);

  logger.log(`Start checking all assigned documents`);

  await Promise.all(
    documents.map(async (document, index) => {
      logger.log(`Checking assignation ${index + 1}/${documents.length}`);
      const assignation = assignations.find(({ documentId }) =>
        idModule.lib.equalId(documentId, idModule.lib.buildId(document._id)),
      );
      if (!assignation) {
        logger.log(
          `Inconsistency: assignation not found for document status ${document.status}. Resetting the document to free...`,
        );
        await documentService.updateDocumentStatus(document._id, 'free');
      }
      return;
    }),
  );
}

async function cleanFreeDocuments() {
  logger.log(`cleanFreeDocuments`);

  await freePendingDocuments();

  const documentRepository = buildDocumentRepository();

  logger.log(`Deleting assignations and their treatments for free documents`);
  const freeDocuments = await documentRepository.findAllByStatusProjection(
    ['free'],
    ['_id'],
  );

  const freeDocumentIds = freeDocuments.map(({ _id }) => _id);
  for (let i = 0, length = freeDocumentIds.length; i < length; i++) {
    logger.log(
      `Deleting assignations and their treatments : ${i + 1}/${length}`,
    );
    await assignationService.deleteAssignationsByDocumentId(freeDocumentIds[i]);
  }

  logger.log('Done');
}

async function cleanAssignations() {
  logger.log(`cleanAssignations`);
  const FORBIDDEN_STATUSES_FOR_ASSIGNATED_DOCUMENT: documentType['status'][] = [
    'loaded',
    'nlpAnnotating',
    'free',
  ];
  const documentRepository = buildDocumentRepository();
  const assignationRepository = buildAssignationRepository();

  const documents = await documentRepository.findAllProjection([
    '_id',
    'status',
  ]);
  const assignations = await assignationRepository.findAllProjection([
    '_id',
    'documentId',
  ]);
  logger.log(`Start checking all assignations`);

  await Promise.all(
    assignations.map(async (assignation, index) => {
      logger.log(`Checking assignation ${index + 1}/${assignations.length}`);
      const document = documents.find(({ _id }) =>
        idModule.lib.equalId(_id, idModule.lib.buildId(assignation.documentId)),
      );
      if (
        !document ||
        FORBIDDEN_STATUSES_FOR_ASSIGNATED_DOCUMENT.includes(document.status)
      ) {
        logger.log(
          `Inconsistency: document not found or status inconsistent. Deleting the assignation...`,
        );
        await assignationService.deleteAssignation(assignation._id);
      }
      return;
    }),
  );
  logger.log(`Done!`);
}

async function cleanTreatments() {
  logger.log(`cleanTreatments`);
  const documentRepository = buildDocumentRepository();
  const documents = await documentRepository.findAllByStatusProjection(
    [
      'loaded',
      'nlpAnnotating',
      'free',
      'pending',
      'saved',
      'rejected',
      'done',
      'toBePublished',
    ],
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
