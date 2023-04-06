import { documentType } from '@label/core';

export { extractRouteForJuritj };

function extractRouteForJuritj({}: {
  session: documentType['decisionMetadata']['session'];
  solution: documentType['decisionMetadata']['solution'];
  publicationCategory: documentType['publicationCategory'];
  chamberId: string;
  civilMatterCode: documentType['decisionMetadata']['civilMatterCode'];
  civilCaseCode: documentType['decisionMetadata']['civilCaseCode'];
  criminalCaseCode: documentType['decisionMetadata']['criminalCaseCode'];
  NACCode: documentType['decisionMetadata']['NACCode'];
  endCaseCode: documentType['decisionMetadata']['endCaseCode'];
}): documentType['route'] {
  return 'exhaustive';
}
