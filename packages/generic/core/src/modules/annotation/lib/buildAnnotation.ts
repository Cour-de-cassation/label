import { omitMongoIdType } from "../../../types";
import { buildMongoId } from "../../../utils";
import { annotationType } from "../annotationType";
import { computeAnnotationEntityId } from "./computeAnnotationEntityId";

export { buildAnnotation };

function buildAnnotation(
  annotationFields: Omit<omitMongoIdType<annotationType>, "entityId">
): annotationType {
  return {
    ...annotationFields,
    entityId: computeAnnotationEntityId(annotationFields),
    _id: buildMongoId(),
  };
}
