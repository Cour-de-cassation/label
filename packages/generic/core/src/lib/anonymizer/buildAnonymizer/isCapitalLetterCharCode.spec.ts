import { isCapitalLetterCharCode } from './isCapitalLetterCharCode';

describe('isCapitalLetterCharCode', () => {
  it('should be truthy', () => {
    expect(isCapitalLetterCharCode('E'.charCodeAt(0))).toBeTruthy();
  });

  it('should be falsy', () => {
    expect(isCapitalLetterCharCode('^'.charCodeAt(0))).toBeFalsy();
    expect(isCapitalLetterCharCode('!'.charCodeAt(0))).toBeFalsy();
    expect(isCapitalLetterCharCode('$'.charCodeAt(0))).toBeFalsy();
  });
});
