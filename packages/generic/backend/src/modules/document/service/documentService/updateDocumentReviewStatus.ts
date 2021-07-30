import { documentType, errorHandlers, idModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { updateDocumentReviewStatus };

async function updateDocumentReviewStatus(
  _id: documentType['_id'],
  reviewStatus: documentType['reviewStatus'],
) {
  const documentRepository = buildDocumentRepository();
  const updatedDocument = await documentRepository.updateOne(_id, {
    reviewStatus,
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
