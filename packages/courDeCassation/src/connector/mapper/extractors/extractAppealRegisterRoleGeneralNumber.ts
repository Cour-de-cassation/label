import { logger } from '@label/backend';
export { extractAppealRegisterRoleGeneralNumber, isCorrectAppeal };

const REGEX_1 = /\D\s(\d{2}-\d{2}\.\d{3})/;
const REGEX_2 = /\d{2}-\d{5}/;

function extractAppealRegisterRoleGeneralNumber(
  text: string,
  source?: string,
  jurisdictionName?: string,
  appeals?: string,
  registerNumber?: string,
  numeroRoleGeneral?: string,
) {
  logger.log({
    operationName: 'extractAppealRegisterRoleGeneralNumber',
    msg: `source : ${source} -- juridictionName : ${jurisdictionName} -- appeal : ${appeals} -- registreNumber : ${registerNumber} -- numeroRoleGenral : ${numeroRoleGeneral}`,
  });

  if (source != '' || undefined) {
    let response;
    // si jurica => regsiterNumber else regext
    if (source === 'jurica' && registerNumber != '') {
      // logger.log({
      //   operationName: 'je suis dans jurica if',
      //   msg: ` ${source}`,
      // });
      response =
        registerNumber != undefined || ''
          ? registerNumber?.split(' ')[0]
          : regexExtractAppealNumber(text) || '';
      return response;
    } // jurinet affiche appeals ou regex
    else if (source === 'jurinet') {
      if (jurisdictionName?.includes('cassation') && appeals) {
        const appealNumber = appeals?.replace(/[A-Za-z]/g, '');
        // Supprime toutes les lettres devant S245907
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
    } // tj affiche numeroRoleGeneral
    else if (source === 'juritj' && numeroRoleGeneral) {
      response =
        numeroRoleGeneral != undefined || ''
          ? numeroRoleGeneral
          : regexExtractAppealNumber(text) || '';
      return response;
    } else {
      const appealNumber = regexExtractAppealNumber(text);
      return appealNumber;
    }
  } else {
    const appealNumber = regexExtractAppealNumber(text);
    return appealNumber;
  }
}

// regex de base
function regexExtractAppealNumber(text: string) {
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

// je verifie pour l'insertion en base label pour le champs decisionMetadata: { appealNumber: que si pourvoi
function isCorrectAppeal(value: string | undefined) {
  const appealNumber = /^\d{2}-\d{2}\.\d{3}$/.test(value!) ? value : undefined;
  return appealNumber;
}
