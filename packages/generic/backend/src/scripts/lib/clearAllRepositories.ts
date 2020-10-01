import { buildAnnotationRepository } from '../../modules/annotation';
import { buildAnnotationReportRepository } from '../../modules/annotationReport';
import { buildDocumentRepository } from '../../modules/document';

export { clearAllRepositories };

async function clearAllRepositories() {
  const repositories = [
    buildAnnotationRepository,
    buildAnnotationReportRepository,
    buildDocumentRepository,
  ].map((buildRepository) => buildRepository());

  await Promise.all(repositories.map((repository) => repository.clear()));
}
