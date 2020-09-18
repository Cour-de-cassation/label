import '@babel/polyfill';
import { buildFakeAnnotationRepository } from '../modules/annotation';
import { buildFakeCourtDecisionRepository } from '../modules/courtDecision';
import { buildFakeNlpReportRepository } from '../modules/nlpReport';

global.beforeEach(() => {
  const fakeRepositoryBuilders = [
    buildFakeAnnotationRepository,
    buildFakeCourtDecisionRepository,
    buildFakeNlpReportRepository,
  ];

  fakeRepositoryBuilders.forEach(buildFakeRepository => {
    const fakeRepository = buildFakeRepository();
    fakeRepository.reinitialize();
  });
});
