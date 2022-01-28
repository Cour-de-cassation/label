import { idModule, treatmentModule } from '@label/core';
import {
  buildDocumentRepository,
  documentService,
} from '../../../modules/document';
import { treatmentService } from '../../../modules/treatment';
import { logger } from '../../../utils';

export { cleanTreatments };

/**
 * Reset documents with unconsistent annotations
 */
async function cleanTreatments() {
  logger.log(`cleanTreatments`);
  const documentRepository = buildDocumentRepository();
  const documents = await documentRepository.findAllProjection(['_id']);
  const documentIds = documents.map(({ _id }) => _id);
  for (let i = 0, length = documents.length; i < length; i++) {
    try {
      const treatments = await treatmentService.fetchTreatmentsByDocumentId(
        documentIds[i],
      );
      treatmentModule.lib.computeAnnotations(treatments);
    } catch (error) {
      logger.log(
        `Resetting document ${idModule.lib.convertToString(documents[i]._id)}`,
      );
      logger.error(error);
      await documentService.updateDocumentStatus(documentIds[i], 'loaded');
    }
  }
  logger.log('cleanTreatments done!');
}
