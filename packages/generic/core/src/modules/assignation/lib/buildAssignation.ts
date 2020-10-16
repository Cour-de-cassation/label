import { buildMongoId } from "../../../lib";
import { omitMongoIdType } from "../../../types";
import { assignationType } from "../assignationType";

export { buildAssignation };

function buildAssignation(
  assignationFields: omitMongoIdType<assignationType>
): assignationType {
  return {
    ...assignationFields,
    _id: buildMongoId(),
  };
}
