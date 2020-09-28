import '@babel/polyfill';
import { buildFakeAnnotationRepository } from '../modules/annotation';
import { buildFakeAnnotationReportRepository } from '../modules/annotationReport';
import { buildFakeDocumentRepository } from '../modules/courtDecision';

global.beforeEach(() => {
  const fakeRepositoryBuilders = [
    buildFakeAnnotationRepository,
    buildFakeAnnotationReportRepository,
    buildFakeDocumentRepository,
  ];

  fakeRepositoryBuilders.forEach(buildFakeRepository => {
    const fakeRepository = buildFakeRepository();
    fakeRepository.reinitialize();
  });
});
