import { assignationType } from "./assignationType";
import { buildAssignation } from "./lib";

export { assignationModule };

export type { assignationType };

const assignationModule = {
  lib: { buildAssignation },
};
