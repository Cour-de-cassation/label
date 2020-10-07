import { buildMongoId } from "../../../utils";
import { generatorType } from "../../../types";
import { annotationType } from "../annotationType";

export { annotationGenerator };

const annotationGenerator: generatorType<annotationType> = {
  generate: ({ category, documentId, _id, source, start, text } = {}) => ({
    category: category ? category : `CATEGORY_${Math.random()}`,
    documentId: documentId ? buildMongoId(documentId) : buildMongoId(),
    _id: _id ? buildMongoId(_id) : buildMongoId(),
    source: source ? source : `SOURCE_${Math.random()}`,
    start: start ? start : 0,
    text: text ? text : `TEXT_${Math.random()}`,
  }),
};
