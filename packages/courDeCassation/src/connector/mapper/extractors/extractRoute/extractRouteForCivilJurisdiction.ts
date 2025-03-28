import { documentType } from '@label/core';
import { sderApi } from '../../../../sderApi';
import { Sources } from 'dbsder-api-types';

export { extractRouteForCivilJurisdiction };

async function extractRouteForCivilJurisdiction({
  source,
  NACCode,
  additionalTermsToAnnotate,
}: {
  source: documentType['source'];
  NACCode: documentType['decisionMetadata']['NACCode'];
  additionalTermsToAnnotate: documentType['decisionMetadata']['additionalTermsToAnnotate'];
}): Promise<documentType['route']> {
  // Relecture exhaustive pour les décisions présentant un intéret particulier
  // En attente de validation métier pour être implémenté
  // if (selection === 'true') {
  //   return 'exhaustive';
  // }

  // Relecture exhaustive pour les décisions comportant des demandes d'occultation particulières
  if (additionalTermsToAnnotate != '') {
    return 'exhaustive';
  }

  if (source === Sources.TCOM) {
    return 'default';
  }

  if (source === Sources.CA || source === Sources.TJ) {
    const routeFromDb = await sderApi.getDecisionRoute({
      codeNac: NACCode,
    });
    switch (routeFromDb) {
      case 'systematique':
        return 'exhaustive';
      case 'aleatoireSensible':
        return Math.random() < 0.1 ? 'exhaustive' : 'automatic';
      case 'aleatoireNonSensible':
        return Math.random() < 0.01 ? 'exhaustive' : 'automatic';
      default:
        throw new Error('Route non trouvée en base');
    }
  }

  return 'default';
}
