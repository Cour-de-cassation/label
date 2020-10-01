import '@babel/polyfill';
import { buildAnnotationRepository } from '../modules/annotation';
import { buildAnnotationReportRepository } from '../modules/annotationReport';
import { buildDocumentRepository } from '../modules/document';

global.beforeEach(async () => {
  const repositories = [
    buildAnnotationRepository,
    buildAnnotationReportRepository,
    buildDocumentRepository,
  ].map((buildRepository) => buildRepository());

  await Promise.all(repositories.map((repository) => repository.clear()));
});
