import { buildPreAssignationRepository } from '../../modules/preAssignation';
import { buildAssignationRepository } from '../../modules/assignation';
import { buildDocumentRepository } from '../../modules/document';
import { buildProblemReportRepository } from '../../modules/problemReport';
import { buildStatisticRepository } from '../../modules/statistic';
import { buildTreatmentRepository } from '../../modules/treatment';
import { buildUserRepository } from '../../modules/user';
import { logger } from '../../utils';

export { clearDb };

async function clearDb({
  annotation = true,
  assignation = true,
  document = true,
  problemReport = true,
  statistic = true,
  treatment = true,
  user = true,
  preAssignations = true,
}: {
  annotation?: boolean;
  assignation?: boolean;
  document?: boolean;
  problemReport?: boolean;
  statistic?: boolean;
  treatment?: boolean;
  user?: boolean;
  preAssignations?: boolean;
}) {
  logger.log({
    operationName: 'clearDb',
    msg: 'Clearing db',
    data: {
      annotation,
      assignation,
      document,
      problemReport,
      statistic,
      treatment,
      user,
      preAssignations,
    },
  });

  const repositories = [
    {
      shouldClear: assignation,
      buildRepository: buildAssignationRepository,
    },
    {
      shouldClear: document,
      buildRepository: buildDocumentRepository,
    },
    {
      shouldClear: problemReport,
      buildRepository: buildProblemReportRepository,
    },
    {
      shouldClear: statistic,
      buildRepository: buildStatisticRepository,
    },
    {
      shouldClear: treatment,
      buildRepository: buildTreatmentRepository,
    },
    {
      shouldClear: user,
      buildRepository: buildUserRepository,
    },
    {
      shouldClear: preAssignations,
      buildRepository: buildPreAssignationRepository,
    },
  ]
    .filter(({ shouldClear }) => shouldClear)
    .map(({ buildRepository }) => buildRepository());

  await Promise.all(repositories.map((repository) => repository.clear()));
}
