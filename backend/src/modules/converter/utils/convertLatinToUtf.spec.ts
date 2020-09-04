import { convertLatinToUtf } from './convertLatinToUtf';

describe('convertLatinToUtf', () => {
  it('should convert a buffer from latin1 encoding to a utf8 string', () => {
    const latinBuffer = Buffer.from([0xb0, 0xe7, 0xe8, 0xe9, 0xf9]);

    const utfString = convertLatinToUtf(latinBuffer);

    expect(utfString).toBe('°çèéù');
  });
});
