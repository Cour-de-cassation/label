import { splitTextAccordingToNewLine } from './splitTextAccordingToNewLine';

describe('splitTextAccordingToNewLine', () => {
  it('should split according to all splitting characters', () => {
    const text = 'line1\r\r\n \r\r\nline2\r\r\nline3\nline4';

    const splittedText = splitTextAccordingToNewLine(text);

    expect(splittedText).toEqual(['line1', '', ' ', '', 'line2', '', 'line3', 'line4']);
  });
});
