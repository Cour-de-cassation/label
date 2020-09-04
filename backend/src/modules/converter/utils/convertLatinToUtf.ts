import { decode } from 'iconv-lite';

function convertLatinToUtf(buffer: Buffer) {
  return decode(buffer, 'latin1');
}

export { convertLatinToUtf };
