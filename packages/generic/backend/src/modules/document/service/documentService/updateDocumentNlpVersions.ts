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
    throw new Error(
      `The document ${idModule.lib.convertToString(
        _id,
      )} was not found in the document collection`,
    );
  }
  return nlpVersions;
}
