import { documentType, idModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { updateDocumentChecklist };

async function updateDocumentChecklist(
  _id: documentType['_id'],
  checklist: documentType['checklist'],
) {
  const documentRepository = buildDocumentRepository();
  const updatedDocument = await documentRepository.updateChecklistById(
    _id,
    checklist,
  );
  if (!updatedDocument) {
    throw new Error(
      `The document ${idModule.lib.convertToString(
        _id,
      )} was not found in the document collection`,
    );
  }
  return updatedDocument;
}
