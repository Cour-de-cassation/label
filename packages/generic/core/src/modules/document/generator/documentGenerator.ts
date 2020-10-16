import { buildMongoId } from "../../../lib";
import { generatorType } from "../../../types";
import { documentType } from "../documentType";

export { documentGenerator };

const documentGenerator: generatorType<documentType> = {
  generate: ({
    creationDate,
    documentId,
    _id,
    metadata,
    source,
    text,
  } = {}) => ({
    creationDate: creationDate ? creationDate : new Date(),
    documentId: documentId ? documentId : `DOCUMENT_ID_${Math.random()}`,
    _id: _id ? buildMongoId(_id) : buildMongoId(),
    metadata: metadata ? metadata : `METADATA_${Math.random()}`,
    source: source ? source : `SOURCE_${Math.random()}`,
    text: text ? text : `TEXT_${Math.random()}`,
  }),
};
