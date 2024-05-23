import { preAssignationModel, preAssignationType } from './preAssignationType';
import { preAssignationGenerator } from './generator';
import { buildPreAssignation } from './lib';

export { preAssignationModule };

export type { preAssignationType };

const preAssignationModule = {
  model: preAssignationModel,
  generator: preAssignationGenerator,
  lib: { buildPreAssignation },
};
