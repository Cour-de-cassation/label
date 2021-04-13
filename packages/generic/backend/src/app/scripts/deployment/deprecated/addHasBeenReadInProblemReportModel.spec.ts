import { omit } from 'lodash';
import { problemReportModule, problemReportType } from '@label/core';
import { buildProblemReportRepository } from '../../../../modules/problemReport';
import { addHasBeenReadInProblemReportModel } from './addHasBeenReadInProblemReportModel';

describe('addHasBeenReadInProblemReportModel.spec', () => {
  it('should add a false hasBeenRead value in the problemReport data model in the database', async () => {
    const problemReportRepository = buildProblemReportRepository();
    const problemReports = [
      problemReportModule.generator.generate(),
      problemReportModule.generator.generate(),
      problemReportModule.generator.generate(),
    ];
    const problemReportsWithOldModel = problemReports.map((problemReport) =>
      omit(problemReport, ['hasBeenRead']),
    );
    await Promise.all(
      ((problemReportsWithOldModel as any) as problemReportType[]).map(
        problemReportRepository.insert,
      ),
    );

    await addHasBeenReadInProblemReportModel();

    const problemReportsAfterUpdateModel = await problemReportRepository.findAll();
    expect(problemReportsAfterUpdateModel.sort()).toEqual(
      problemReports.sort(),
    );
  });
});
