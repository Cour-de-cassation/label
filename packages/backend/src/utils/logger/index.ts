import { dependencyManager } from '../dependencyManager';
import { localLogger } from './localLogger';
import { testLogger } from './testLogger';

export { injectedLogger as logger };

const injectedLogger = dependencyManager.inject({
  forLocal: localLogger,
  forProd: localLogger,
  forTest: testLogger,
});
