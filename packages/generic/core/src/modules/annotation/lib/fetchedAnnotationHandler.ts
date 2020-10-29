import { idModule, idType } from "../../id";
import { fetchedAnnotationType } from "../annotationType";
import { entityIdHandler } from "./entityIdHandler";

export { fetchedAnnotationHandler };

const fetchedAnnotationHandler = {
  create,
  update,
  updateMany,
};

const LABEL_ANNOTATION_SOURCE = "label";

function create(
  category: string,
  documentId: idType,
  index: number,
  text: string
): fetchedAnnotationType {
  return idModule.lib.buildObjectWithId({
    category,
    start: index,
    documentId,
    entityId: entityIdHandler.compute(category, text),
    source: LABEL_ANNOTATION_SOURCE,
    text,
  });
}

function updateMany(
  annotations: fetchedAnnotationType[],
  updateAnnotation: (annotation: fetchedAnnotationType) => fetchedAnnotationType
): fetchedAnnotationType[] {
  return annotations.map((annotation) => update(annotation, updateAnnotation));
}

function update(
  annotation: fetchedAnnotationType,
  updateAnnotation: (annotation: fetchedAnnotationType) => fetchedAnnotationType
): fetchedAnnotationType {
  return {
    ...updateAnnotation(annotation),
    source: LABEL_ANNOTATION_SOURCE,
  };
}
