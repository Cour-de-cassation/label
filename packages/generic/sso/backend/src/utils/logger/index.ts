import { dependencyManager } from '../dependencyManager';
import { localLogger } from './localLogger';
import { prodLogger } from './prodLogger';
import { testLogger } from './testLogger';

export { injectedLogger as logger };

const injectedLogger = dependencyManager.inject({
  forLocal: localLogger,
  forPreProd: prodLogger,
  forProd: localLogger,
  forTest: testLogger,
});
