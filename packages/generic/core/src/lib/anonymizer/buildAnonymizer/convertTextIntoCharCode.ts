import { range } from 'lodash';

export { convertTextIntoCharCode };

const A_ASCII_CODE = 65;

function convertTextIntoCharCode(text: string) {
  return parseInt(
    range(text.length)
      .map((_, index) => text.toUpperCase().charCodeAt(index) - A_ASCII_CODE + 1)
      .join(''),
    10,
  );
}
