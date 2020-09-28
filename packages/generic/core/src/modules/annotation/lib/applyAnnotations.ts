import { annotationEntityType } from "../../annotationEntity";
import { annotationType } from "../annotationType";

export { applyAnnotations };

function applyAnnotations(
  text: string,
  annotations: Array<annotationType>,
  anonymiser: (annotationEntity: annotationEntityType) => string
): string {
  const sortedAnnotations = sortAnnotations(annotations);
  const anonymisedTextChunks = slicedAndAnonymiseText(
    text,
    sortedAnnotations,
    anonymiser
  );

  return anonymisedTextChunks.reduce(
    (anonymisedText, anomisedTextChunk) =>
      `${anonymisedText}${anomisedTextChunk}`,
    ""
  );
}

function sortAnnotations(annotations: Array<annotationType>) {
  return annotations.sort(
    (annotation1, annotation2) => annotation1.start - annotation2.start
  );
}

function slicedAndAnonymiseText(
  text: string,
  sortedAnnotations: Array<annotationType>,
  anonymiser: (annotationEntity: annotationEntityType) => string
) {
  const anonymisedTextChunks = [];

  let currentIndex = 0;
  sortedAnnotations.forEach((annotation) => {
    anonymisedTextChunks.push(text.slice(currentIndex, annotation.start));
    anonymisedTextChunks.push(anonymiser(annotation.annotationEntity));
    currentIndex = annotation.start + annotation.text.length;
  });
  anonymisedTextChunks.push(text.slice(currentIndex));

  return anonymisedTextChunks;
}
