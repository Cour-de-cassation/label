import { errorHandlers } from 'sder-core';
import { documentType, idModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { updateDocumentAdditionalTermsParsingFailed };

async function updateDocumentAdditionalTermsParsingFailed(
  _id: documentType['_id'],
  additionalTermsParsingFailed: documentType['decisionMetadata']['additionalTermsParsingFailed'],
) {
  const documentRepository = buildDocumentRepository();
  const updatedDocument = await documentRepository.updateAdditionalTermsParsingFailed(
    _id,
    additionalTermsParsingFailed,
  );
  if (!updatedDocument) {
    throw errorHandlers.notFoundErrorHandler.build(
      `The document ${idModule.lib.convertToString(
        _id,
      )} was not found in the document collection`,
    );
  }
  return updatedDocument;
}
