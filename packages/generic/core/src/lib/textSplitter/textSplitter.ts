import { isEqual } from "lodash";
import { annotationType } from "../../modules";

export { textSplitter };

export type { annotationChunkType, textChunkType };

const textSplitter = {
  splitTextAccordingToAnnotations,
  buildTextChunk,
  buildAnnotationChunk,
  applyToChunk,
  removeEmptyTextChunks,
};

type annotationChunkType<annotationT extends annotationNeededFieldsType> = {
  type: "annotation";
  annotation: annotationT;
};
type textChunkType = { type: "text"; text: string };

type annotationNeededFieldsType = Pick<
  annotationType,
  "text" | "category" | "start"
>;

function splitTextAccordingToAnnotations<
  annotationT extends annotationNeededFieldsType
>(
  text: string,
  annotations: annotationT[]
): Array<annotationChunkType<annotationT> | textChunkType> {
  const sortedAnnotations = [...annotations].sort(
    (annotation1, annotation2) => annotation1.start - annotation2.start
  );

  const splittedText: Array<
    annotationChunkType<annotationT> | textChunkType
  > = [];

  let currentIndex = 0;
  sortedAnnotations.forEach((annotation) => {
    splittedText.push(
      buildTextChunk(text.slice(currentIndex, annotation.start))
    );
    splittedText.push(buildAnnotationChunk(annotation));
    currentIndex = annotation.start + annotation.text.length;
  });
  splittedText.push(buildTextChunk(text.slice(currentIndex)));

  return removeEmptyTextChunks(splittedText);
}

function buildTextChunk(text: string) {
  return {
    type: "text",
    text,
  } as const;
}

function buildAnnotationChunk<annotationT extends annotationNeededFieldsType>(
  annotation: annotationT
) {
  return { type: "annotation", annotation: annotation } as const;
}

function applyToChunk<annotationT extends annotationNeededFieldsType, T>(
  chunk: annotationChunkType<annotationT> | textChunkType,
  textChunkFunction: (text: string) => T,
  annotationChunkFunction: (annotation: annotationT) => T
): T {
  switch (chunk.type) {
    case "annotation":
      return annotationChunkFunction(chunk.annotation);
    case "text":
      return textChunkFunction(chunk.text);
  }
}

function removeEmptyTextChunks<annotationT extends annotationNeededFieldsType>(
  chunks: Array<textChunkType | annotationChunkType<annotationT>>
): Array<textChunkType | annotationChunkType<annotationT>> {
  return chunks.filter(
    (chunk) => !isEqual(chunk, textSplitter.buildTextChunk(""))
  );
}
