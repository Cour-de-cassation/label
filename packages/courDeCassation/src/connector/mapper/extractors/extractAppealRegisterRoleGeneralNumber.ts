export { extractAppealRegisterRoleGeneralNumber };

function extractAppealRegisterRoleGeneralNumber(
  text: string,
  source: string,
  jurisdictionName?: string,
  appeal?: string,
  registerNumber?: string,
  numeroRoleGeneral?: string,
) {
  if (source === 'jurica' && registerNumber != undefined) {
    return registerNumber?.split(' ')[0];
  } else if (source === 'jurinet') {
    const verifappeal = /^[A-Za-z]\d+$/;
    if (
      jurisdictionName?.includes('cassation') &&
      appeal != undefined &&
      verifappeal.test(appeal)
    ) {
      appeal = appeal?.replace(/[A-Za-z]/g, '');
      const formattedappeal =
        appeal.substring(0, 2) +
        '-' +
        appeal.substring(2, 4) +
        '.' +
        appeal.substring(4);
      return formattedappeal;
    } else {
      return appeal;
    }
  } else if (source === 'juritj' && numeroRoleGeneral != undefined) {
    return numeroRoleGeneral;
  } else {
    return regexExtractAppealNumber(text);
  }
}

// regex de base
const REGEX_1 = /\D\s(\d{2}-\d{2}\.\d{3})/;
const REGEX_2 = /\d{2}-\d{5}/;
export function regexExtractAppealNumber(text: string) {
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
