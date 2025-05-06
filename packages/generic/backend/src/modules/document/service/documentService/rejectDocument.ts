import { documentType } from '@label/core';
import { updateDocumentStatus } from './updateDocumentStatus';
import { problemReportService } from '../../../problemReport';

export { rejectDocument };

async function rejectDocument(id: documentType['_id']) {
  await problemReportService.deleteProblemReportsByDocumentId(id);
  updateDocumentStatus(id, 'rejected');
}
