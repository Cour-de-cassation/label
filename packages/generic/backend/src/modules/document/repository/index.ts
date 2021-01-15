import { dependencyManager } from '@label/core';
import { buildDocumentRepository } from './buildDocumentRepository';
import { buildFakeDocumentRepository } from './buildFakeDocumentRepository';

export { buildRepository as buildDocumentRepository };

const buildRepository = dependencyManager.inject({
  forLocal: buildDocumentRepository,
  forProd: buildDocumentRepository,
  forTest: buildFakeDocumentRepository,
});
