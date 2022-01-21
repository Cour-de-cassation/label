import { documentType, errorHandlers, idModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { resetDocumentReviewStatus };

async function resetDocumentReviewStatus(_id: documentType['_id']) {
  const documentRepository = buildDocumentRepository();

  const updatedDocument = await documentRepository.updateOne(_id, {
    reviewStatus: { viewerNames: [], hasBeenAmended: false },
  });

  if (!updatedDocument) {
    throw errorHandlers.notFoundErrorHandler.build(
      `The document ${idModule.lib.convertToString(
        _id,
      )} was not found in the document collection`,
    );
  }

  return updatedDocument;
}
