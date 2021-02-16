import { textChunkContentType } from '@label/core';
import { textSelectionType } from '../DocumentPanel/DocumentText';

export { computeMultilineSelection };

export type { textNeighboursType };

type textNeighboursType = {
  before: textChunkContentType[];
  current: textChunkContentType;
  after: textChunkContentType[];
};

function computeMultilineSelection(
  selectionText: string,
  neighbours: textNeighboursType,
  anchorNodeValue: string,
  focusNodeValue: string,
) {
  const compiledText = [
    ...neighbours.before.reverse().map((textChunk) => textChunk.text),
    neighbours.current.text,
    ...neighbours.after.map((textChunk) => textChunk.text),
  ].join('');
  const isMultilineSelection = compiledText.includes(anchorNodeValue) && compiledText.includes(focusNodeValue);
  if (isMultilineSelection) {
    const cleanedText = selectionText
      .split('\t')
      .map((lineText) => {
        const match = lineText.replace(/\n[0-9]+\n/g, '').replace(/\n/g, '');
        return match.trim();
      })
      .filter(Boolean);
    if (neighbours.current.text.indexOf(cleanedText[0]) > -1) {
      const nextTexts = neighbours.after.filter(({ text }) => !!text.trim());
      const textSelection = cleanedText.reduce((accumulator, textLine) => {
        const currentTextChunk = [neighbours.current, ...nextTexts].find(({ text }) => text.indexOf(textLine) > -1);
        if (!currentTextChunk) {
          return accumulator;
        }
        return [
          ...accumulator,
          { text: textLine, index: currentTextChunk.index + currentTextChunk.text.indexOf(textLine) },
        ];
      }, [] as textSelectionType);
      return textSelection;
    } else if (neighbours.current.text.indexOf(cleanedText[cleanedText.length - 1]) > -1) {
      const previousTexts = neighbours.before.filter(({ text }) => !!text.trim());
      const textSelection = cleanedText.reduce((accumulator, textLine) => {
        const currentTextChunk = [...previousTexts, neighbours.current].find(({ text }) => text.indexOf(textLine) > -1);
        if (!currentTextChunk) {
          return accumulator;
        }
        return [
          ...accumulator,
          { text: textLine, index: currentTextChunk.index + currentTextChunk.text.indexOf(textLine) },
        ];
      }, [] as textSelectionType);
      return textSelection;
    }
    return [];
  }
  return [];
}
