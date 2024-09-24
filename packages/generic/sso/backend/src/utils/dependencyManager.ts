import { buildDependencyManager } from '@label/core';

export { dependencyManager };

const { dependencyManager } = buildDependencyManager(process.env.RUN_MODE);
