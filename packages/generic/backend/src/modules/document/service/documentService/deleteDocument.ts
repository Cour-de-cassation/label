import { documentType } from '@label/core';
import { problemReportService } from '../../../problemReport';
import { assignationService } from '../../../assignation';
import { treatmentService } from '../../../treatment';
import { buildDocumentRepository } from '../../repository';

export { deleteDocument };

async function deleteDocument(id: documentType['_id']) {
  const documentRepository = buildDocumentRepository();

  await assignationService.deleteAssignationsByDocumentId(id);
  await treatmentService.deleteTreatmentsByDocumentId(id);
  await problemReportService.deleteProblemReportsByDocumentId(id);

  await documentRepository.deleteById(id);
}
