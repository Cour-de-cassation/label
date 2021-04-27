import { annotationType } from '../annotationType';

export { computeNearbyText };

const CHARACTER_COUNT_TO_SHOW = 25;
const LINE_SEPARATION_CHARACTERS = ['\n', '\r'];

function computeNearbyText(annotation: annotationType, text: string) {
  const lineSeparationCharacterBeforeIndex = computeLineSeparationCharacterBeforeIndex(text, annotation.start);
  const lineSeparationCharacterAfterIndex = computeLineSeparationCharacterAfterIndex(
    text,
    annotation.start + annotation.text.length,
  );

  const indexToStartFrom = Math.max(lineSeparationCharacterBeforeIndex, annotation.start - CHARACTER_COUNT_TO_SHOW);
  const indexToEndWith = Math.min(
    lineSeparationCharacterAfterIndex,
    annotation.start + annotation.text.length + CHARACTER_COUNT_TO_SHOW,
  );

  const textStart = indexToStartFrom + 1;
  const textEnd = indexToEndWith;
  return { textStart, textEnd };
}

function computeLineSeparationCharacterBeforeIndex(text: string, annotationStart: number) {
  for (const LINE_SEPARATION_CHARACTER of LINE_SEPARATION_CHARACTERS) {
    const lineSeparationCharacterIndex = text.lastIndexOf(LINE_SEPARATION_CHARACTER, annotationStart);
    if (lineSeparationCharacterIndex !== -1) {
      return lineSeparationCharacterIndex;
    }
  }
  return 0;
}

function computeLineSeparationCharacterAfterIndex(text: string, annotationEnd: number) {
  for (const LINE_SEPARATION_CHARACTER of LINE_SEPARATION_CHARACTERS) {
    const lineSeparationCharacterIndex = text.indexOf(LINE_SEPARATION_CHARACTER, annotationEnd);
    if (lineSeparationCharacterIndex !== -1) {
      return lineSeparationCharacterIndex;
    }
  }
  return text.length;
}
