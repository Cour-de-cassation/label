import { parseFormatSpecifiers } from './parseFormatSpecifiers';

describe('parseFormatSpecifier', () => {
  it('should parse format specifier %c', () => {
    const printfString = '[firstName %c]';

    const parsedFormatSpecifiers = parseFormatSpecifiers(printfString);

    expect(parsedFormatSpecifiers).toEqual([{ index: 11, specifier: '%c' }]);
  });

  it('should parse format specifier %d', () => {
    const printfString = '[adresse %d]';

    const parsedFormatSpecifiers = parseFormatSpecifiers(printfString);

    expect(parsedFormatSpecifiers).toEqual([{ index: 9, specifier: '%d' }]);
  });
});
