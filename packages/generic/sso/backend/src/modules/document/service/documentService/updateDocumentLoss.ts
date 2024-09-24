import { errorHandlers } from 'sder-core';
import { documentType, idModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { updateDocumentLoss };

async function updateDocumentLoss(
  _id: documentType['_id'],
  loss: documentType['loss'],
) {
  const documentRepository = buildDocumentRepository();
  const updatedDocument = await documentRepository.updateLossById(_id, loss);
  if (!updatedDocument) {
    throw errorHandlers.notFoundErrorHandler.build(
      `The document ${idModule.lib.convertToString(
        _id,
      )} was not found in the document collection`,
    );
  }
  return updatedDocument;
}
