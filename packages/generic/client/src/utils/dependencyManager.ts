import { buildDependencyManager } from '@label/core';
export { dependencyManager };

const { dependencyManager } = buildDependencyManager(process.env.REACT_ENV_RUN_MODE);
