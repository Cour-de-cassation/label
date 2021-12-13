import { buildAssignationRepository } from '../../../..//modules/assignation';
import { buildProblemReportRepository } from '../../../..//modules/problemReport';
import { logger } from '../../../../utils';

export { up, down };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
async function up() {
  logger.log('Up: ');

  const problemReportRepository = buildProblemReportRepository();
  const assignationRepository = buildAssignationRepository();

  const problemReports = await problemReportRepository.findAll();

  await Promise.all(
    problemReports.map(async (problemReport) => {
      const assignation = await assignationRepository.findById(
        (problemReport as any).assignationId,
      );
      problemReportRepository.updateOne(problemReport._id, {
        documentId: assignation.documentId,
        userId: assignation.userId,
      });
    }),
  );

  await problemReportRepository.deletePropertiesForMany({}, ['assignationId']);
}

async function down() {
  logger.log('Down: ');

  const problemReportRepository = buildProblemReportRepository();
  const assignationRepository = buildAssignationRepository();

  const problemReports = await problemReportRepository.findAll();

  await Promise.all(
    problemReports.map(async (problemReport) => {
      const assignation = await assignationRepository.findByDocumentIdAndUserId(
        problemReport,
      );
      if (assignation) {
        problemReportRepository.updateOne(problemReport._id, {
          assignationId: assignation._id,
        } as any);
      }
    }),
  );

  await problemReportRepository.deletePropertiesForMany({}, [
    'documentId',
    'userId',
  ]);
}
