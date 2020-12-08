import { buildAnnotationRepository } from '../../modules/annotation';
import { buildAnnotationReportRepository } from '../../modules/annotationReport';
import { buildAssignationRepository } from '../../modules/assignation';
import { buildDocumentRepository } from '../../modules/document';
import { buildMonitoringEntryRepository } from '../../modules/monitoringEntry';
import { buildProblemReportRepository } from '../../modules/problemReport';
import { buildUserRepository } from '../../modules/user';

export { clearAllRepositories };

async function clearAllRepositories() {
  const repositories = [
    buildAnnotationRepository,
    buildAnnotationReportRepository,
    buildAssignationRepository,
    buildDocumentRepository,
    buildMonitoringEntryRepository,
    buildProblemReportRepository,
    buildUserRepository,
  ].map((buildRepository) => buildRepository());

  await Promise.all(repositories.map((repository) => repository.clear()));
}
