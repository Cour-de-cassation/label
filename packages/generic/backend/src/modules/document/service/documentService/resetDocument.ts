import { documentType } from '@label/core';
import { assignationService } from '../../../../modules/assignation';
import { treatmentService } from '../../../../modules/treatment';

export { resetDocument };

async function resetDocument(documentId: documentType['_id']) {
  await assignationService.deleteAssignationsByDocumentId(documentId);
  await treatmentService.deleteTreatmentsByDocumentId(documentId);
}
