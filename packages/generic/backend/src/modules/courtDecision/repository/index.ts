import { dependencyManager } from '../../../utils';
import { buildDocumentRepository } from './buildDocumentRepository';
import { buildFakeDocumentRepository } from './buildFakeDocumentRepository';

export {
  buildRepository as buildDocumentRepository,
  buildFakeDocumentRepository,
};

const buildRepository = dependencyManager.inject({
  forLocal: buildDocumentRepository,
  forProd: buildDocumentRepository,
  forTest: buildFakeDocumentRepository,
});
