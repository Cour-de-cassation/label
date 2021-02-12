import { range } from 'lodash';
import { annotationType, textSplitter, textChunkType, annotationChunkType } from '@label/core';

export { getSplittedTextByLine };

export type { splittedTextByLineType };

type splittedTextByLineType = Array<{
  line: number;
  content: Array<textChunkType | annotationChunkType>;
}>;

function getSplittedTextByLine(text: string, annotations: annotationType[]): splittedTextByLineType {
  const numberOfLines = splitTextAccordingToNewLine(text).length;
  const splittedText = textSplitter.splitTextAccordingToAnnotations(text, annotations);
  const splittedTextByLine = computeSplittedTextByLine(splittedText, numberOfLines);

  return splittedTextByLine.map(({ line, content }) => ({
    line,
    content: textSplitter.removeEmptyTextChunks(content),
  }));
}

function computeSplittedTextByLine(splittedText: Array<textChunkType | annotationChunkType>, numberOfLines: number) {
  const splittedTextByLine: splittedTextByLineType = range(1, numberOfLines + 1).map((line) => ({ line, content: [] }));

  let currentLine = 0;
  splittedText.forEach((chunk) => {
    switch (chunk.type) {
      case 'text':
        const splittedTextAccordingToNewline = splitTextAccordingToNewLine(chunk.content.text);
        let currentIndex = chunk.content.index;
        splittedTextAccordingToNewline.forEach((textLine, lineIndex) => {
          const after = computeAfterNeighbours(splittedTextAccordingToNewline, chunk.content.index, lineIndex);
          const before = computeBeforeNeighbours(splittedTextAccordingToNewline, chunk.content.index, lineIndex);
          splittedTextByLine[currentLine + lineIndex].content.push(
            textSplitter.buildTextChunk(textLine, currentIndex, before, after),
          );
          currentIndex = currentIndex + textLine.length + 1;
        });
        currentLine = currentLine + splittedTextAccordingToNewline.length - 1;
        break;
      case 'annotation':
        splittedTextByLine[currentLine].content.push(textSplitter.buildAnnotationChunk(chunk.annotation));
        break;
    }
  });

  return splittedTextByLine;
}

function computeBeforeNeighbours(
  splittedTextAccordingToNewline: string[],
  chunkContentIndex: number,
  lineIndex: number,
) {
  const before = [];
  let currentIndex = chunkContentIndex;
  for (let i = 0, length = lineIndex; i < length; i++) {
    const textLine = splittedTextAccordingToNewline[i];
    before.push({ text: textLine, index: currentIndex });
    currentIndex += textLine.length + 1;
  }
  return before;
}

function computeAfterNeighbours(
  splittedTextAccordingToNewline: string[],
  chunkContentIndex: number,
  lineIndex: number,
) {
  const after = [];
  let currentIndex = chunkContentIndex;
  for (let i = 0, length = lineIndex + 1; i < length; i++) {
    const textLine = splittedTextAccordingToNewline[i];
    currentIndex += textLine.length + 1;
  }

  for (let i = lineIndex + 1, length = splittedTextAccordingToNewline.length; i < length; i++) {
    const textLine = splittedTextAccordingToNewline[i];
    after.push({ text: textLine, index: currentIndex });
    currentIndex += textLine.length + 1;
  }
  return after;
}

function splitTextAccordingToNewLine(text: string): string[] {
  return text.split('\r');
}
