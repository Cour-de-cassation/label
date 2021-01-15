import { annotationType } from '../../modules';

export { textSplitter };

export type { annotationChunkType, textChunkType };

const textSplitter = {
  splitTextAccordingToAnnotations,
  buildTextChunk,
  buildAnnotationChunk,
  removeEmptyTextChunks,
};

type annotationChunkType = {
  type: 'annotation';
  index: number;
  annotation: annotationType;
};

type textChunkType = { type: 'text'; index: number; text: string };

function splitTextAccordingToAnnotations(
  text: string,
  annotations: annotationType[],
): Array<annotationChunkType | textChunkType> {
  const sortedAnnotations = [...annotations].sort((annotation1, annotation2) => annotation1.start - annotation2.start);

  const splittedText: Array<annotationChunkType | textChunkType> = [];

  let currentIndex = 0;
  sortedAnnotations.forEach((annotation) => {
    splittedText.push(buildTextChunk(text.slice(currentIndex, annotation.start), currentIndex));
    splittedText.push(buildAnnotationChunk(annotation));
    currentIndex = annotation.start + annotation.text.length;
  });
  splittedText.push(buildTextChunk(text.slice(currentIndex), currentIndex));

  return removeEmptyTextChunks(splittedText);
}

function buildTextChunk(text: string, index: number): textChunkType {
  return {
    type: 'text',
    index,
    text,
  } as const;
}

function buildAnnotationChunk(annotation: annotationType): annotationChunkType {
  return {
    type: 'annotation',
    index: annotation.start,
    annotation: annotation,
  } as const;
}

function removeEmptyTextChunks(
  chunks: Array<textChunkType | annotationChunkType>,
): Array<textChunkType | annotationChunkType> {
  return chunks.filter((chunk) => chunk.type !== 'text' || chunk.text !== '');
}
