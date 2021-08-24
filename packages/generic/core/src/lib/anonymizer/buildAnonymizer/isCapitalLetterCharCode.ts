export { isCapitalLetterCharCode };
const A_ASCII_CODE = 65;
const Z_ASCII_CODE = 90;

function isCapitalLetterCharCode(charCode: number) {
  return charCode >= A_ASCII_CODE && charCode <= Z_ASCII_CODE;
}
