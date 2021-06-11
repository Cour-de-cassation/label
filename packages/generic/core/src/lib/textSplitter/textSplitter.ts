import { annotationType } from '../../modules/annotation';

export { textSplitter };

export type { annotationChunkType, textChunkType, textChunkContentType };

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

type textChunkType = {
  type: 'text';
  content: textChunkContentType;
  before: textChunkContentType[];
  after: textChunkContentType[];
};

type textChunkContentType = { index: number; text: string };

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

function buildTextChunk(
  text: string,
  index: number,
  before?: textChunkContentType[],
  after?: textChunkContentType[],
): textChunkType {
  return {
    type: 'text',
    content: {
      index,
      text,
    },
    before: before || [],
    after: after || [],
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
  return chunks.filter((chunk) => chunk.type !== 'text' || chunk.content.text !== '');
}
