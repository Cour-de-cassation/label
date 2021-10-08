import { splitTextIntoWords } from './splitTextIntoWords';

describe('splitTextIntoWords', () => {
  it('should split text according to space and dashes', () => {
    const text = 'Harry Potter and Carla Bruni-Sarkozy';

    const words = splitTextIntoWords(text, 10);

    expect(words).toEqual([
      { text: 'Harry', start: 10 },
      { text: 'Potter', start: 16 },
      { text: 'and', start: 23 },
      { text: 'Carla', start: 27 },
      { text: 'Bruni', start: 33 },
      { text: 'Sarkozy', start: 39 },
    ]);
  });
});
