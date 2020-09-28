import { dependencyManager } from '../../../utils';
import { buildCourtDecisionRepository } from './buildCourtDecisionRepository';
import { buildFakeCourtDecisionRepository } from './buildFakeCourtDecisionRepository';

export {
  buildRepository as buildCourtDecisionRepository,
  buildFakeCourtDecisionRepository,
};

const buildRepository = dependencyManager.inject({
  forLocal: buildCourtDecisionRepository,
  forProd: buildCourtDecisionRepository,
  forTest: buildFakeCourtDecisionRepository,
});
