import { annotationType } from '../../modules';

export { textSplitter };

export type { annotationChunkType, textChunkType };

const textSplitter = {
  splitTextAccordingToAnnotations,
  buildTextChunk,
  buildAnnotationChunk,
  removeEmptyTextChunks,
};

type annotationChunkType<annotationT extends annotationNeededFieldsType> = {
  type: 'annotation';
  index: number;
  annotation: annotationT;
};

type textChunkType = { type: 'text'; index: number; text: string };

type annotationNeededFieldsType = Pick<
  annotationType,
  'text' | 'category' | 'start'
>;

function splitTextAccordingToAnnotations<
  annotationT extends annotationNeededFieldsType
>(
  text: string,
  annotations: annotationT[],
): Array<annotationChunkType<annotationT> | textChunkType> {
  const sortedAnnotations = [...annotations].sort(
    (annotation1, annotation2) => annotation1.start - annotation2.start,
  );

  const splittedText: Array<
    annotationChunkType<annotationT> | textChunkType
  > = [];

  let currentIndex = 0;
  sortedAnnotations.forEach((annotation) => {
    splittedText.push(
      buildTextChunk(text.slice(currentIndex, annotation.start), currentIndex),
    );
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

function buildAnnotationChunk<annotationT extends annotationNeededFieldsType>(
  annotation: annotationT,
): annotationChunkType<annotationT> {
  return {
    type: 'annotation',
    index: annotation.start,
    annotation: annotation,
  } as const;
}

function removeEmptyTextChunks<annotationT extends annotationNeededFieldsType>(
  chunks: Array<textChunkType | annotationChunkType<annotationT>>,
): Array<textChunkType | annotationChunkType<annotationT>> {
  return chunks.filter((chunk) => chunk.type !== 'text' || chunk.text !== '');
}
