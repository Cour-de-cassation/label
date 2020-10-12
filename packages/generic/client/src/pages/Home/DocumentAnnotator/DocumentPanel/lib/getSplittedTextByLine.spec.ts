import { annotationModule, textSplitter } from '@label/core';
import { getSplittedTextByLine } from './getSplittedTextByLine';

describe('getSplittedTextByLine', () => {
  const annotations = [
    { category: 'firstName', text: 'Benoit', start: 0 },
    { category: 'firstName', text: 'Nicolas', start: 29 },
    { category: 'firstName', text: 'Romain', start: 62 },
  ].map(annotationModule.generator.generate);

  it('should split a text according to the given annotations', () => {
    const text = 'Benoit is software engineer. Nicolas is a software engineer.\r\rRomain is a designer.';

    const splittedTextByLine = getSplittedTextByLine(text, annotations);

    expect(splittedTextByLine).toEqual([
      [
        textSplitter.buildAnnotationChunk(annotations[0]),
        textSplitter.buildTextChunk(' is software engineer. '),
        textSplitter.buildAnnotationChunk(annotations[1]),
        textSplitter.buildTextChunk(' is a software engineer.'),
      ],
      [],
      [textSplitter.buildAnnotationChunk(annotations[2]), textSplitter.buildTextChunk(' is a designer.')],
    ]);
  });
});
