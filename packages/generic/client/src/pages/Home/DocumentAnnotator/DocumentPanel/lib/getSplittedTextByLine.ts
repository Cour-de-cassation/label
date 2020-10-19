import { range } from 'lodash';
import { fetchedAnnotationType, textSplitter, textChunkType, annotationChunkType } from '@label/core';

export { getSplittedTextByLine };

function getSplittedTextByLine(
  text: string,
  annotations: fetchedAnnotationType[],
): Array<Array<textChunkType | annotationChunkType<fetchedAnnotationType>>> {
  const numberOfLines = splitTextAccordingToNewLine(text).length;
  const splittedText = textSplitter.splitTextAccordingToAnnotations(text, annotations);
  const splittedTextByLine = computeSplittedTextByLine(splittedText, numberOfLines);

  return splittedTextByLine.map(textSplitter.removeEmptyTextChunks);
}

function computeSplittedTextByLine(
  splittedText: Array<textChunkType | annotationChunkType<fetchedAnnotationType>>,
  numberOfLines: number,
) {
  const splittedTextByLine: Array<Array<textChunkType | annotationChunkType<fetchedAnnotationType>>> = range(
    1,
    numberOfLines + 1,
  ).map(() => []);

  let currentLine = 0;
  splittedText.forEach((chunk) =>
    textSplitter.applyToChunk(
      chunk,
      (text) => {
        const splittedTextAccordingToNewline = splitTextAccordingToNewLine(text);
        splittedTextAccordingToNewline.forEach((textLine, ind) =>
          splittedTextByLine[currentLine + ind].push({
            ...textSplitter.buildTextChunk(textLine),
          }),
        );
        currentLine = currentLine + splittedTextAccordingToNewline.length - 1;
      },
      (annotation) =>
        splittedTextByLine[currentLine].push({
          ...textSplitter.buildAnnotationChunk(annotation),
        }),
    ),
  );

  return splittedTextByLine;
}

function splitTextAccordingToNewLine(text: string): string[] {
  return text.split('\r');
}
