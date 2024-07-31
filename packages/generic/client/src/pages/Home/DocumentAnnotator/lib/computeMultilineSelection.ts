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
  //la détextion de isMultilineSelection ne marche pas quand il y a plusieurs paragraphes
  const compiledText = [
    ...neighbours.before.reverse().map((textChunk) => textChunk.text),
    neighbours.current.text,
    ...neighbours.after.map((textChunk) => textChunk.text),
  ].join('');
  // console.log(`compiledText : ${compiledText}`);
  const isMultilineSelection = compiledText.includes(anchorNodeValue) && compiledText.includes(focusNodeValue);
  // console.log(`isMultilineSelection : ${isMultilineSelection}`);

  if (true) {
    console.log(`selectionText : ${JSON.stringify(selectionText)}`);
    let cleannedText = selectionText.replace(/\n\d+\n/g, '\n'); //si il y a un nombre isolé sur une ligne ça n'entraine pas du bazar ?
    console.log(`cleannedText : ${JSON.stringify(cleannedText)}`);

    const splittedText = selectionText.split('\n');
    const firstChunkText = splittedText[0];
    const lastChunkText = splittedText[splittedText.length - 1];
    console.log(`firstChunkText : ${JSON.stringify(firstChunkText)}`);
    console.log(`lastChunkText : ${JSON.stringify(lastChunkText)}`);

    // First chunk index can be found in current or before neighbour in case of selection from top to bottom or bottom to top
    let firstChunkIndex = -1;

    if (neighbours.current.text.indexOf(firstChunkText) > -1) {
      firstChunkIndex = neighbours.current.index;
      console.log('bottom to top');
      cleannedText =
        focusNodeValue + cleannedText.slice(firstChunkText.length, -lastChunkText.length) + anchorNodeValue;
    } else {
      for (let i = neighbours.before.length - 1; i >= 0; i--) {
        const beforeNeighbour = neighbours.before[i];
        if (beforeNeighbour.text.indexOf(firstChunkText) > -1) {
          firstChunkIndex = beforeNeighbour.index;
          break;
        }
      }

      console.log('top to bottom');
      cleannedText =
        anchorNodeValue + cleannedText.slice(firstChunkText.length, -lastChunkText.length) + focusNodeValue;
    }

    console.log(`final multiline : ${JSON.stringify({ text: cleannedText, index: firstChunkIndex })}`);

    if (firstChunkIndex > -1) {
      return [{ text: cleannedText, index: firstChunkIndex }];
    }
  }
  return [];
}
