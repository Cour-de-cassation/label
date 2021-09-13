import { documentType } from '@label/core';
import { annotationReportService } from '../../../../modules/annotationReport';
import { assignationService } from '../../../../modules/assignation';
import { treatmentService } from '../../../../modules/treatment';

export { resetDocument };

async function resetDocument(documentId: documentType['_id']) {
  await annotationReportService.deleteAnnotationReportsByDocumentId(documentId);
  await assignationService.deleteAssignationsByDocumentId(documentId);
  await treatmentService.deleteTreatmentsByDocumentId(documentId);
}
