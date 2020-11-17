import { annotationModule, textSplitter } from '@label/core';
import { getSplittedTextByLine } from './getSplittedTextByLine';

describe('getSplittedTextByLine', () => {
  const annotations = [
    { category: 'firstName', text: 'Benoit', start: 0 },
    { category: 'firstName', text: 'Nicolas', start: 29 },
    { category: 'firstName', text: 'Romain', start: 66 },
  ].map(annotationModule.generator.generate);

  it('should split a text according to the given annotations', () => {
    const text = 'Benoit is software engineer. Nicolas is a software engineer.\r\rAnd Romain is a designer.';

    const splittedTextByLine = getSplittedTextByLine(text, annotations);

    expect(splittedTextByLine).toEqual([
      {
        line: 1,
        content: [
          textSplitter.buildAnnotationChunk(annotations[0]),
          textSplitter.buildTextChunk(' is software engineer. ', 6),
          textSplitter.buildAnnotationChunk(annotations[1]),
          textSplitter.buildTextChunk(' is a software engineer.', 36),
        ],
      },
      {
        line: 2,
        content: [],
      },
      {
        line: 3,
        content: [
          textSplitter.buildTextChunk('And ', 62),
          textSplitter.buildAnnotationChunk(annotations[2]),
          textSplitter.buildTextChunk(' is a designer.', 72),
        ],
      },
    ]);
  });
});
