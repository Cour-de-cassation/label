export { extractAppealNumber };

const REGEX_1 = /\D\s(\d{2}-\d{2}\.\d{3})/;

const REGEX_2 = /\d{2}-\d{5}/;

function extractAppealNumber(text: string) {
  const match1 = text.match(REGEX_1);
  if (!!match1 && match1[1]) {
    return match1[1];
  }
  const match2 = text.match(REGEX_2);
  if (!!match2 && match2[0]) {
    return match2[0];
  }
  return undefined;
}
