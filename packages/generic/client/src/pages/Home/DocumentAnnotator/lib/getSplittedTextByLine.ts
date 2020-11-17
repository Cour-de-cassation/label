import { range } from 'lodash';
import { fetchedAnnotationType, textSplitter, textChunkType, annotationChunkType } from '@label/core';

export { getSplittedTextByLine };

export type { splittedTextByLineType };

type splittedTextByLineType = Array<{
  line: number;
  content: Array<textChunkType | annotationChunkType<fetchedAnnotationType>>;
}>;

function getSplittedTextByLine(text: string, annotations: fetchedAnnotationType[]): splittedTextByLineType {
  const numberOfLines = splitTextAccordingToNewLine(text).length;
  const splittedText = textSplitter.splitTextAccordingToAnnotations(text, annotations);
  const splittedTextByLine = computeSplittedTextByLine(splittedText, numberOfLines);

  return splittedTextByLine.map(({ line, content }) => ({
    line,
    content: textSplitter.removeEmptyTextChunks(content),
  }));
}

function computeSplittedTextByLine(
  splittedText: Array<textChunkType | annotationChunkType<fetchedAnnotationType>>,
  numberOfLines: number,
) {
  const splittedTextByLine: splittedTextByLineType = range(1, numberOfLines + 1).map((line) => ({ line, content: [] }));

  let currentLine = 0;
  splittedText.forEach((chunk) => {
    switch (chunk.type) {
      case 'text':
        const splittedTextAccordingToNewline = splitTextAccordingToNewLine(chunk.text);
        let currentIndex = chunk.index;
        splittedTextAccordingToNewline.forEach((textLine, ind) => {
          splittedTextByLine[currentLine + ind].content.push({
            ...textSplitter.buildTextChunk(textLine, currentIndex),
          });
          currentIndex = currentIndex + textLine.length + 1;
        });
        currentLine = currentLine + splittedTextAccordingToNewline.length - 1;
        break;
      case 'annotation':
        splittedTextByLine[currentLine].content.push({
          ...textSplitter.buildAnnotationChunk(chunk.annotation),
        });
        break;
    }
  });

  return splittedTextByLine;
}

function splitTextAccordingToNewLine(text: string): string[] {
  return text.split('\r');
}
