import { errorHandlers } from 'sder-core';
import { documentType, idModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { updateDocumentCategoriesToOmit };

async function updateDocumentCategoriesToOmit(
  _id: documentType['_id'],
  newCategoriesToOmit: documentType['decisionMetadata']['categoriesToOmit'],
) {
  const documentRepository = buildDocumentRepository();
  // const updatedDocument = await documentRepository.updateCategoriesToOmitById(_id, newCategoriesToOmit);
  // if (!updatedDocument) {
  //   throw errorHandlers.notFoundErrorHandler.build(
  //     `The document ${idModule.lib.convertToString(
  //       _id,
  //     )} was not found in the document collection`,
  //   );
  // }
  return await documentRepository.findById(_id);
}
