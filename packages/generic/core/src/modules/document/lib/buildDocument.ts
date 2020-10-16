import { idModule, omitIdType } from "../../id";
import { documentType } from "../documentType";

export { buildDocument };

function buildDocument(documentFields: omitIdType<documentType>): documentType {
  return {
    ...documentFields,
    _id: idModule.lib.buildId(),
  };
}
