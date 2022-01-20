import { documentType } from '@label/core';
import { extractRouteForJurica } from './extractRouteForJurica';
import { extractRouteForJurinet } from './extractRouteForJurinet';

export { extractRoute };

function extractRoute(
  routeInfos: {
    session: documentType['decisionMetadata']['session'];
    solution: documentType['decisionMetadata']['solution'];
    publicationCategory: documentType['publicationCategory'];
    chamberId: string;
    civilMatterCode: documentType['decisionMetadata']['civilMatterCode'];
    civilCaseCode: documentType['decisionMetadata']['civilCaseCode'];
    criminalCaseCode: documentType['decisionMetadata']['criminalCaseCode'];
    NACCode: documentType['decisionMetadata']['NACCode'];
    endCaseCode: documentType['decisionMetadata']['endCaseCode'];
  },
  source: documentType['source'],
): documentType['route'] {
  switch (source) {
    case 'jurinet':
      try {
        return extractRouteForJurinet({ ...routeInfos });
      } catch (e) {
        return 'exhaustive';
      }
      break;
    case 'jurica':
      try {
        return extractRouteForJurica({ ...routeInfos });
      } catch (e) {
        return 'exhaustive';
      }
      break;
  }

  return 'default';
}
