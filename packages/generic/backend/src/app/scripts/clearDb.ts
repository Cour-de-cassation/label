import { buildAnnotationReportRepository } from '../../modules/annotationReport';
import { buildAssignationRepository } from '../../modules/assignation';
import { buildDocumentRepository } from '../../modules/document';
import { buildMigrationRepository } from '../../modules/migration';
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
  migration = true,
  problemReport = true,
  statistic = true,
  treatment = true,
  user = true,
}: {
  annotation?: boolean;
  assignation?: boolean;
  document?: boolean;
  migration?: boolean;
  problemReport?: boolean;
  statistic?: boolean;
  treatment?: boolean;
  user?: boolean;
}) {
  logger.log(
    `clearDb ${JSON.stringify(
      {
        annotation,
        assignation,
        document,
        migration,
        problemReport,
        statistic,
        treatment,
        user,
      },
      null,
      2,
    )}`,
  );

  const repositories = [
    {
      shouldClear: annotation,
      buildRepository: buildAnnotationReportRepository,
    },
    {
      shouldClear: assignation,
      buildRepository: buildAssignationRepository,
    },
    {
      shouldClear: document,
      buildRepository: buildDocumentRepository,
    },
    {
      shouldClear: migration,
      buildRepository: buildMigrationRepository,
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
  ]
    .filter(({ shouldClear }) => shouldClear)
    .map(({ buildRepository }) => buildRepository());

  await Promise.all(repositories.map((repository) => repository.clear()));
}
