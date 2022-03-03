import { logger, treatmentService } from '@label/backend';
import { documentType } from '@label/core';
import { extractRouteForJurica } from './extractRouteForJurica';
import { extractRouteForJurinet } from './extractRouteForJurinet';

export { extractRoute };

async function extractRoute(
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
  documentId: documentType['_id'],
  source: documentType['source'],
): Promise<documentType['route']> {
  let route: documentType['route'] = 'default';

  switch (source) {
    case 'jurinet':
      try {
        route = extractRouteForJurinet({ ...routeInfos });
      } catch (e) {
        logger.log(e);
        route = 'exhaustive';
      }
      break;
    case 'jurica':
      try {
        route = extractRouteForJurica({ ...routeInfos });
      } catch (e) {
        logger.log(e);
        route = 'exhaustive';
      }
      break;
  }

  if (route == 'simple' || route == 'default') {
    try {
      const treatments = await treatmentService.fetchTreatmentsByDocumentId(
        documentId,
      );
      for (const treatment of treatments) {
        console.log(treatment);
        if (treatment['source'] == 'supplementaryAnnotations') {
          route = 'exhaustive';
        }
      }
    } catch (e) {
      logger.log(e);
    }
  }

  return route;
}
