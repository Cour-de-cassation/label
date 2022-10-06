import { documentType } from '@label/core';
import { updateDocumentStatus } from './updateDocumentStatus';

export { rejectDocument };

async function rejectDocument(id: documentType['_id']) {
  updateDocumentStatus(id, 'rejected');
}
