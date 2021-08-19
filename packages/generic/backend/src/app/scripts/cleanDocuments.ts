import { idModule } from '@label/core';
import { assignationService } from '../../modules/assignation';
import { buildDocumentRepository } from '../../modules/document';
import { treatmentService } from '../../modules/treatment';
import { logger } from '../../utils';

export { cleanDocuments };

async function cleanDocuments() {
  logger.log(`cleanDocuments`);

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

  for (const loadedDocumentId of loadedDocumentsIds) {
    logger.log(
      `Deleting assignations and related treatments and problemReports for ${idModule.lib.convertToString(
        loadedDocumentId,
      )}`,
    );
    await assignationService.deleteAssignationsByDocumentId(loadedDocumentId);
    await treatmentService.deleteTreatmentsByDocumentId(loadedDocumentId);
  }

  logger.log('Done');
}
