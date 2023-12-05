import { idModule, treatmentModule } from '@label/core';
import {
  buildDocumentRepository,
  documentService,
} from '../../../modules/document';
import { treatmentService } from '../../../modules/treatment';
import { logger } from '../../../utils';

export { cleanUnconsistentTreatments };

/**
 * Reset documents with unconsistent annotations
 */
async function cleanUnconsistentTreatments() {
  logger.log({ operationName: 'cleanUnconsistentTreatments', msg: 'START' });
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
      logger.error({
        operationName: 'cleanUnconsistentTreatments',
        msg: `Resetting document ${idModule.lib.convertToString(
          documents[i]._id,
        )}`,
        data: error as Record<string, unknown>,
      });
      await documentService.updateDocumentStatus(documentIds[i], 'loaded');
    }
  }
  logger.log({ operationName: 'cleanUnconsistentTreatments', msg: 'DONE' });
}
