import { documentType } from '@label/core';

export { extractRouteForJuritcom };

function extractRouteForJuritcom({}: {
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
  return 'exhaustive';
}
