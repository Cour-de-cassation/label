import { assignationModel, assignationType } from './assignationType';
import { assignationGenerator } from './generator';
import { buildAssignation } from './lib';

export { assignationModule };

export type { assignationType };

const assignationModule = {
  model: assignationModel,
  generator: assignationGenerator,
  lib: { buildAssignation },
};
