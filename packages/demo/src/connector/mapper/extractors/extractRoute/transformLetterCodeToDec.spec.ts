import { transformLetterCodeToDec } from '.';

describe('transformLetterCodeToDec', () => {
  it('should return 11.01 with 11A', () => {
    const code = transformLetterCodeToDec({ code: '11A' });

    expect(code).toBe(11.01);
  });
  it('should return 22.26 with 22Z', () => {
    const code = transformLetterCodeToDec({ code: '22Z' });

    expect(code).toBe(22.26);
  });
});
