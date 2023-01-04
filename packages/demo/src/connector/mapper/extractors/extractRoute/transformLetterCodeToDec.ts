export { transformLetterCodeToDec };

function transformLetterCodeToDec({ code }: { code: string }): number {
  let returnValue = '';
  Array.from(code).forEach((c) => {
    const alphabetRank = c.toUpperCase().charCodeAt(0) - 64;
    if (alphabetRank > 0 && alphabetRank <= 26) {
      returnValue += '.' + [alphabetRank < 10 ? '0' : ''] + alphabetRank;
    } else {
      returnValue += c;
    }
  });

  return parseFloat(returnValue);
}
