import { idModule, problemReportType } from '@label/core';
import {
  buildFakeRepositoryBuilder,
  updateFakeCollection,
} from '../../../repository';
import { customProblemReportRepositoryType } from './customProblemReportRepositoryType';

export { buildFakeProblemReportRepository };

const buildFakeProblemReportRepository = buildFakeRepositoryBuilder<
  problemReportType,
  customProblemReportRepositoryType
>({
  buildCustomFakeRepository: (collection) => ({
    async deleteByAssignationId(assignationId) {
      updateFakeCollection(
        collection,
        collection.filter(
          (problemReport) =>
            !idModule.lib.equalId(problemReport.assignationId, assignationId),
        ),
      );
    },
  }),
});
