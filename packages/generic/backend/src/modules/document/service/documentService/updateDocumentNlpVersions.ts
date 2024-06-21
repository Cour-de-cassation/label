import { errorHandlers } from 'sder-core';
import { documentType, idModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { updateDocumentNlpVersions };

async function updateDocumentNlpVersions(
  _id: documentType['_id'],
  nlpVersions: documentType['nlpVersions'],
) {
  const documentRepository = buildDocumentRepository();
  const updatedDocument = await documentRepository.updateNlpVersionsById(
    _id,
    nlpVersions,
  );
  if (!updatedDocument) {
    throw errorHandlers.notFoundErrorHandler.build(
      `The document ${idModule.lib.convertToString(
        _id,
      )} was not found in the document collection`,
    );
  }
  return nlpVersions;
}
