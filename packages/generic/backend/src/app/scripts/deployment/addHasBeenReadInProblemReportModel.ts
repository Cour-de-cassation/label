import { buildProblemReportRepository } from '../../../modules/problemReport';

export { addHasBeenReadInProblemReportModel };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
async function addHasBeenReadInProblemReportModel() {
  const problemReportRepository = buildProblemReportRepository();

  const problemReports = await problemReportRepository.findAll();

  const problemReportsWithNewDataModel = problemReports.map(
    (problemReport) => ({
      ...problemReport,
      hasBeenRead: false,
    }),
  );

  await problemReportRepository.clear();

  await Promise.all(
    problemReportsWithNewDataModel.map(problemReportRepository.insert),
  );
}
