import { errorHandlers } from 'sder-core';
import { documentType, idModule } from '@label/core';
import { assignationService } from '../../../assignation';
import { buildDocumentRepository } from '../../repository';
import { resetDocument } from './resetDocument';

export { updateDocumentStatus };

async function updateDocumentStatus(
  _id: documentType['_id'],
  status: documentType['status'],
) {
  const documentRepository = buildDocumentRepository();
  const updatedDocument = await documentRepository.updateStatusById(
    _id,
    status,
  );
  if (!updatedDocument) {
    throw errorHandlers.notFoundErrorHandler.build(
      `The document ${idModule.lib.convertToString(
        _id,
      )} was not found in the document collection`,
    );
  }
  if (status === 'free') {
    await assignationService.deleteAssignationsByDocumentId(_id);
  } else if (status === 'loaded') {
    await resetDocument(_id);
  }
  return updatedDocument;
}
