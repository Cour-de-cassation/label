import { decode, encode } from 'iconv-lite';

const decoder = {
  convertLatinToUtf(buffer: Buffer) {
    return decode(buffer, 'latin1');
  },

  convertUtfToLatin(str: string) {
    return encode(str, 'latin1');
  },
};

export { decoder };
