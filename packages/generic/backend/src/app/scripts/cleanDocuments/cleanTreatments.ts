import { treatmentModule } from '@label/core';
import {
  buildDocumentRepository,
  documentService,
} from '../../../modules/document';
import { treatmentService } from '../../../modules/treatment';
import { logger } from '../../../utils';

export { cleanTreatments };

async function cleanTreatments() {
  logger.log(`cleanTreatments`);
  const documentRepository = buildDocumentRepository();
  const documents = await documentRepository.findAllProjection(['_id']);
  logger.log(`Cleaning ${documents.length} documents`);
  const documentIds = documents.map(({ _id }) => _id);
  for (let i = 0, length = documents.length; i < length; i++) {
    try {
      const treatments = await treatmentService.fetchTreatmentsByDocumentId(
        documentIds[i],
      );
      treatmentModule.lib.computeAnnotations(treatments);
    } catch (error) {
      logger.log(`Error while computing annotations`);
      await documentService.updateDocumentStatus(documentIds[i], 'loaded');
    }
  }
  logger.log('cleanTreatments done!');
}
