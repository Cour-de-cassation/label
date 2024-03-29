import { documentType, documentModule, stringComparator } from '@label/core';

export { extractRouteForJurinet };

function extractRouteForJurinet({
  solution,
  session,
  publicationCategory,
  chamberName,
  civilMatterCode,
  civilCaseCode,
  criminalCaseCode,
}: {
  session: documentType['decisionMetadata']['session'];
  solution: documentType['decisionMetadata']['solution'];
  parties: documentType['decisionMetadata']['parties'];
  publicationCategory: documentType['publicationCategory'];
  chamberName: documentType['decisionMetadata']['chamberName'];
  civilMatterCode: documentType['decisionMetadata']['civilMatterCode'];
  civilCaseCode: documentType['decisionMetadata']['civilCaseCode'];
  criminalCaseCode: documentType['decisionMetadata']['criminalCaseCode'];
  NACCode: documentType['decisionMetadata']['NACCode'];
  endCaseCode: documentType['decisionMetadata']['endCaseCode'];
}): documentType['route'] {
  if (stringComparator.compareNormalizedStrings(solution, 'Non-admission')) {
    return 'automatic';
  }
  if (publicationCategory.includes('C')) {
    return 'confirmation';
  }
  if (chamberName === 'Saisine pour avis' || solution === 'Avis sur saisine') {
    return 'confirmation';
  }
  if (['PL', 'MI'].includes(session)) {
    return 'confirmation';
  }
  if (
    documentModule.lib.publicationHandler.mustBePublished(
      publicationCategory,
    ) ||
    publicationCategory.includes('L') ||
    publicationCategory.includes('R')
  ) {
    return 'exhaustive';
  }

  if (chamberName === 'Chambre criminelle') {
    return 'exhaustive';
  }

  if (
    [
      'ABSEN',
      'ACTRA',
      'ALSPE',
      'ASEDU',
      'ASSCC',
      'ASSNN',
      'ASSOS',
      'AUPAR',
      'AVOCJ',
      'CONTE',
      'COPAC',
      'DIFFA',
      'DIVOR',
      'DOMIC',
      'DONAT',
      'DRINT',
      'DRINTD',
      'ETATC',
      'FILIA',
      'INCAP',
      'INDIV',
      'MARIA',
      'NATIO',
      'NOMPA',
      'OBALI',
      'OPMIN',
      'PARTA',
      'PRESF',
      'PRMED',
      'PROPE',
      'REGIM',
      'RENTE',
      'RGSPE',
      'SECU',
      'SEPUL',
      'SUCCE',
      'SUREN',
      'TESTA',
    ].includes(civilMatterCode)
  ) {
    return 'exhaustive';
  }

  if (
    [
      'COTEX',
      'COTFO',
      'TRARG',
      'AGS',
      'APPREN',
      'CLAUSE',
      'CONGES',
      'CTMAND',
      'CDD',
      'CTAIDE',
      'DEPART',
      'DISCRI',
      'DISCRS',
      'DTDISC',
      'DTIP',
      'DTMAR',
      'DTPUB',
      'DTSYND',
      'DURAUB',
      'DUREE',
      'ESSAI',
      'EXIST',
      'HARCEL',
      'HYGIEN',
      'IMPUTA',
      'LICDIS',
      'LICECO',
      'LICECI',
      'LICPER',
      'MODIFS',
      'MODIFC',
      'MODIFE',
      'REMUN',
      'RETRAI',
      'RUPTUR',
      'SALSTA',
      'SPORT',
      'STATSA',
      'TINTER',
      'USAGES',
      'VIPERS',
      'V.R.P.',
      'PROSOC',
      'HANDI',
      'DTEURO',
      'CONGET',
      'PARTI',
      'ETSA',
      'TPAR',
      'EXPAT',
      'FORFAI',
      'FRAIPR',
      'JOURN',
      'PORTAG',
      'REFERE',
      'SMIC',
      'SEPOUS',
      'TRANSP',
      'SALST2',
    ].includes(civilMatterCode)
  ) {
    return 'exhaustive';
  }

  if (['FP', 'FS'].includes(session)) {
    return 'exhaustive';
  }

  if (
    ['QPC', 'QPCR'].includes(civilCaseCode) ||
    criminalCaseCode === 'QPC' ||
    stringComparator.normalizeString(solution).includes('qpc')
  ) {
    return 'exhaustive';
  }

  if (
    [
      'Déchéance',
      'Déchéance par ordonnance',
      'Désistement',
      'Désistement par arrêt',
    ].some((text) => stringComparator.compareNormalizedStrings(text, solution))
  ) {
    return 'automatic';
  }

  if (publicationCategory.includes('D')) {
    return 'simple';
  }

  if (session === 'FRH' || session === 'FRR') {
    return 'simple';
  }

  if (
    stringComparator.compareNormalizedStrings(
      'Rejet non spécialement motivé',
      solution,
    )
  ) {
    return 'simple';
  }

  return 'default';
}
