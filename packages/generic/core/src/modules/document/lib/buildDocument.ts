import { buildMongoId } from "../../../lib";
import { omitMongoIdType } from "../../../types";
import { documentType } from "../documentType";

export { buildDocument };

function buildDocument(
  documentFields: omitMongoIdType<documentType>
): documentType {
  return {
    ...documentFields,
    _id: buildMongoId(),
  };
}
