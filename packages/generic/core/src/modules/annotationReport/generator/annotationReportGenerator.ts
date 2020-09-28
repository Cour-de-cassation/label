import { buildMongoId } from "../../../utils";
import { generatorType } from "../../../types";
import { annotationReportType } from "../annotationReportType";

export { annotationReportGenerator };

const annotationReportGenerator: generatorType<annotationReportType> = {
  generate: ({ checkList, checkNeeded, documentId, _id } = {}) => ({
    checkList: checkList ? checkList : [],
    checkNeeded: checkNeeded ? checkNeeded : false,
    documentId: documentId ? buildMongoId(documentId) : buildMongoId(),
    _id: _id ? buildMongoId(_id) : buildMongoId(),
  }),
};
