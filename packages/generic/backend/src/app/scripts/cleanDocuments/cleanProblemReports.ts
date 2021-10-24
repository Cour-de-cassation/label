import { idModule, problemReportModule } from '@label/core';
import { buildProblemReportRepository } from '../../../modules/problemReport';
import { buildAssignationRepository } from '../../../modules/assignation';
import { buildDocumentRepository } from '../../../modules/document';
import { logger } from '../../../utils';
import { buildUserRepository } from '../../../modules/user';

export { cleanProblemReports };

async function cleanProblemReports() {
  logger.log(`cleanProblemReports`);
  const documentRepository = buildDocumentRepository();
  const assignationRepository = buildAssignationRepository();
  const problemReportRepository = buildProblemReportRepository();
  const documents = await documentRepository.findAllByStatusProjection(
    ['rejected'],
    ['_id'],
  );
  logger.log(`Cleaning ${documents.length} documents`);
  const documentIds = documents.map(({ _id }) => _id);
  const assignations = await assignationRepository.findAllByDocumentIds(
    documentIds,
  );
  const problemReports = await problemReportRepository.findAllProjection([
    '_id',
    'assignationId',
  ]);
  const userRepository = buildUserRepository();
  const users = await userRepository.findAllByIds();

  for (let i = 0, length = documentIds.length; i < length; i++) {
    const documentId = documentIds[i];
    const assignationsForDocumentId =
      assignations[idModule.lib.convertToString(documentId)];
    if (
      !assignationsForDocumentId.some((assignation) =>
        problemReports.some((problemReport) =>
          idModule.lib.equalId(problemReport.assignationId, assignation._id),
        ),
      )
    ) {
      const assignationId = assignationsForDocumentId[0]._id;
      const user =
        users[
          idModule.lib.convertToString(assignationsForDocumentId[0].userId)
        ];
      const problemReportToInsert = problemReportModule.lib.buildProblemReport({
        assignationId,
        date: new Date().getTime(),
        hasBeenRead: false,
        type: 'bug',
        text: `${user.name} a fait un signalement sur cette décision qui a ensuite été supprimé. Ce message est généré automatiquement`,
      });
      await problemReportRepository.insert(problemReportToInsert);
    }
  }
  logger.log('cleanProblemReports done!');
}
