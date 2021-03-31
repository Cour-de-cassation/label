import { documentGenerator } from '../generator';
import { countWords } from './countWords';

describe('countWords', () => {
  it('should return the number of words in the document text', () => {
    const document = documentGenerator.generate({ text: 'Some text with five words' });

    const wordsCount = countWords(document);

    expect(wordsCount).toEqual(5);
  });
});
