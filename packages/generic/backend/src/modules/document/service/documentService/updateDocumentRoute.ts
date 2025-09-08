import { documentType, idModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { updateDocumentRoute };

async function updateDocumentRoute(
  _id: documentType['_id'],
  route: documentType['route'],
) {
  const documentRepository = buildDocumentRepository();
  const updatedDocument = await documentRepository.updateRouteById(_id, route);
  if (!updatedDocument) {
    throw new Error(
      `The document ${idModule.lib.convertToString(
        _id,
      )} was not found in the document collection`,
    );
  }
  return updatedDocument;
}
