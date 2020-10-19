import { idModule, omitIdType } from "../../id";
import { annotationType } from "../annotationType";
import { entityIdHandler } from "./entityIdHandler";

export { buildAnnotation };

function buildAnnotation(
  annotationFields: Omit<omitIdType<annotationType>, "entityId">
): annotationType {
  return {
    ...idModule.lib.buildObjectWithId(annotationFields),
    entityId: entityIdHandler.compute(
      annotationFields.category,
      annotationFields.text
    ),
  };
}
