import { buildAnnotationRepository } from '../../modules/annotation';
import { buildAnnotationReportRepository } from '../../modules/annotationReport';
import { buildAssignationRepository } from '../../modules/assignation';
import { buildDocumentRepository } from '../../modules/document';
import { buildUserRepository } from '../../modules/user';

export { clearAllRepositories };

async function clearAllRepositories() {
  const repositories = [
    buildAnnotationRepository,
    buildAnnotationReportRepository,
    buildDocumentRepository,
    buildUserRepository,
    buildAssignationRepository,
  ].map((buildRepository) => buildRepository());

  await Promise.all(repositories.map((repository) => repository.clear()));
}
