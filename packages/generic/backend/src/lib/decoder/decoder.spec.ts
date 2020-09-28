import { decoder } from './decoder';

describe('decoder', () => {
  describe('convertLatinToUtf', () => {
    it('should convert a buffer from latin1 encoding to a utf8 string', () => {
      const latinBuffer = Buffer.from([0xb0, 0xe7, 0xe8, 0xe9, 0xf9]);

      const utfString = decoder.convertLatinToUtf(latinBuffer);

      expect(utfString).toBe('°çèéù');
    });
  });
  describe('convertUtfToLatin', () => {
    it('should convert an utf8 string to a latin1 encoded buffer', () => {
      const utfString = '°çèéù';

      const latinBuffer = decoder.convertUtfToLatin(utfString);

      expect([...((latinBuffer as unknown) as Array<number>)]).toEqual([
        0xb0,
        0xe7,
        0xe8,
        0xe9,
        0xf9,
      ]);
    });
  });
});
