import '@babel/polyfill';
import { buildFakeCourtDecisionRepository } from '../modules/courtDecision';

global.beforeEach(() => {
  const fakeCourtDecisionRepository = buildFakeCourtDecisionRepository();
  fakeCourtDecisionRepository.reinitialize();
});
