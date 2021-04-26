import { documentType } from '@label/core';
import { buildTreatmentRepository } from '../../treatment/repository';
import { problemReportService } from '../../problemReport';
import { buildAssignationRepository } from '../repository';

export { deleteAssignationsByDocumentId };

async function deleteAssignationsByDocumentId(documentId: documentType['_id']) {
  const assignationRepository = buildAssignationRepository();
  const treatmentRepository = buildTreatmentRepository();
  const assignationsToDelete = await assignationRepository.findAllByDocumentId(
    documentId,
  );

  await Promise.all(
    assignationsToDelete.map((assignation) =>
      problemReportService.deleteProblemReportsByAssignationId(assignation._id),
    ),
  );
  await treatmentRepository.deleteManyByIds(
    assignationsToDelete.map(({ treatmentId }) => treatmentId),
  );
  await assignationRepository.deleteManyByIds(
    assignationsToDelete.map(({ _id }) => _id),
  );
}
