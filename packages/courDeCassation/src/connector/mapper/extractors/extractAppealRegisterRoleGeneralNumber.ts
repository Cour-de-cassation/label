export { extractAppealRegisterRoleGeneralNumber, getCorrectAppealFormat };

function extractAppealRegisterRoleGeneralNumber(
  text: string,
  source: string,
  jurisdictionName?: string,
  appeals?: string,
  registerNumber?: string,
  numeroRoleGeneral?: string,
) {
  let response;
  let appealNumber;
  if (source === 'jurica' && registerNumber != '') {
    response =
      registerNumber != undefined || ''
        ? registerNumber?.split(' ')[0]
        : regexExtractAppealNumber(text) || '';
    return response;
  } else if (source === 'jurinet') {
    if (jurisdictionName?.includes('cassation') && appeals) {
      appealNumber = appeals?.replace(/[A-Za-z]/g, '');
      const formattedAppeals =
        appealNumber.substring(0, 2) +
        '-' +
        appealNumber.substring(2, 4) +
        '.' +
        appealNumber.substring(4);
      const verifAppeals = /^[A-Za-z]\d+$/;
      response =
        appeals != undefined || verifAppeals.test(appeals)
          ? formattedAppeals
          : regexExtractAppealNumber(text) || '';

      return response;
    } else {
      response =
        appeals != undefined || ''
          ? appeals
          : regexExtractAppealNumber(text) || '';
      return response;
    }
  } else if (source === 'juritj' && numeroRoleGeneral) {
    response =
      numeroRoleGeneral != undefined || ''
        ? numeroRoleGeneral
        : regexExtractAppealNumber(text) || '';
    return response;
  } else {
    appealNumber = regexExtractAppealNumber(text);
    return appealNumber;
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

function getCorrectAppealFormat(value: string | undefined) {
  const appealNumber = /^\d{2}-\d{2}\.\d{3}$/.test(value!) ? value : undefined;
  return appealNumber;
}
