import { documentType } from '@label/core';
import { problemReportService } from '../../../problemReport';
import { annotationReportService } from '../../../annotationReport';
import { assignationService } from '../../../assignation';
import { monitoringEntryService } from '../../../monitoringEntry';
import { treatmentService } from '../../../treatment';
import { buildDocumentRepository } from '../../repository';

export { deleteDocument };

async function deleteDocument(id: documentType['_id']) {
  const documentRepository = buildDocumentRepository();

  await annotationReportService.deleteAnnotationReportsByDocumentId(id);
  await assignationService.deleteAssignationsByDocumentId(id);
  await monitoringEntryService.deleteMonitoringEntriesByDocumentId(id);
  await treatmentService.deleteTreatmentsByDocumentId(id);
  await problemReportService.deleteProblemReportsByDocumentId(id);

  await documentRepository.deleteById(id);
}
