import { dependencyManager } from '@label/core';
import { localLogger } from './localLogger';
import { prodLogger } from './prodLogger';
import { testLogger } from './testLogger';

export { injectedLogger as logger };

const injectedLogger = dependencyManager.inject({
  forLocal: localLogger,
  forProd: prodLogger,
  forTest: testLogger,
});
