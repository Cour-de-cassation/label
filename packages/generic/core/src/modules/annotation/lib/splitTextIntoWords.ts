import { flatten } from 'lodash';

export { splitTextIntoWords };

function splitTextIntoWords(text: string, start: number) {
  return splitAccordingToSeparatingCharacters(text).reduce(
    (accumulator, word) => {
      return [
        ...accumulator,
        {
          text: word,
          start:
            accumulator.length > 0
              ? accumulator[accumulator.length - 1].start + accumulator[accumulator.length - 1].text.length + 1
              : start,
        },
      ];
    },
    [] as Array<{ text: string; start: number }>,
  );
}

function splitAccordingToSeparatingCharacters(text: string) {
  const SEPARATION_CHARACTERS = [' ', '-'];
  let splitText = text.split(SEPARATION_CHARACTERS[0]);

  for (let i = 1, length = SEPARATION_CHARACTERS.length; i < length; i++) {
    splitText = flatten(splitText.map((reSplitText) => reSplitText.split(SEPARATION_CHARACTERS[i])));
  }
  return splitText;
}
