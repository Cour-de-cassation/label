import { documentType, errorHandlers, idModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { updateDocumentReviewStatus };

async function updateDocumentReviewStatus(
  _id: documentType['_id'],
  update: { hasBeenAmended?: boolean; viewerNameToAdd?: string },
) {
  const documentRepository = buildDocumentRepository();
  const document = await documentRepository.findById(_id);

  const viewerNames =
    !!update.viewerNameToAdd &&
    !document.reviewStatus.viewerNames.includes(update.viewerNameToAdd)
      ? [...document.reviewStatus.viewerNames, update.viewerNameToAdd]
      : document.reviewStatus.viewerNames;
  const hasBeenAmended =
    update.hasBeenAmended !== undefined
      ? update.hasBeenAmended
      : document.reviewStatus.hasBeenAmended;

  const updatedDocument = await documentRepository.updateOne(_id, {
    reviewStatus: { viewerNames, hasBeenAmended },
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
