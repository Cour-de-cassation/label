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

type annotationChunkType = { type: "annotation"; annotation: annotationType };
type textChunkType = { type: "text"; text: string };

function splitTextAccordingToAnnotations(
  text: string,
  annotations: annotationType[]
): Array<annotationChunkType | textChunkType> {
  const sortedAnnotations = [...annotations].sort(
    (annotation1, annotation2) => annotation1.start - annotation2.start
  );

  const splittedText: Array<annotationChunkType | textChunkType> = [];

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

function buildAnnotationChunk(annotation: annotationType) {
  return { type: "annotation", annotation: annotation } as const;
}

function applyToChunk<T>(
  chunk: annotationChunkType | textChunkType,
  textChunkFunction: (text: string) => T,
  annotationChunkFunction: (annotation: annotationType) => T
): T {
  switch (chunk.type) {
    case "annotation":
      return annotationChunkFunction(chunk.annotation);
    case "text":
      return textChunkFunction(chunk.text);
  }
}

function removeEmptyTextChunks(
  chunks: Array<textChunkType | annotationChunkType>
): Array<textChunkType | annotationChunkType> {
  return chunks.filter(
    (chunk) => !isEqual(chunk, textSplitter.buildTextChunk(""))
  );
}
