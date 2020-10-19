import { fetchedAnnotationType } from "../annotationType";
import { entityIdHandler } from "./entityIdHandler";

export { annotationLinker };

const annotationLinker = {
  link,
  unlink,
};

function link<annotationT extends fetchedAnnotationType>(
  category: string,
  textSource: string,
  textTarget: string,
  annotations: annotationT[]
): annotationT[] {
  const entityIdSource = findEntityId(textSource);
  const entityIdTarget = findEntityId(textTarget);

  if (!entityIdSource || !entityIdTarget) {
    return annotations;
  }

  return annotations.map((annotation) =>
    annotation.entityId === entityIdSource
      ? { ...annotation, entityId: entityIdTarget }
      : annotation
  );

  function findEntityId(text: string) {
    const annotation = annotations.find(
      (annotation) =>
        annotation.category === category && annotation.text === text
    );

    return annotation?.entityId;
  }
}

function unlink<annotationT extends fetchedAnnotationType>(
  category: string,
  text: string,
  annotations: annotationT[]
): annotationT[] {
  return annotations.map((annotation) =>
    annotation.category === category && annotation.text == text
      ? { ...annotation, entityId: entityIdHandler.compute(category, text) }
      : annotation
  );
}
