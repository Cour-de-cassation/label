import { ressourceFilterType } from '@label/core';

export { buildRessourceFilterRequest };

type ressourceFilterRequestType = {
  publicationCategory?: string[];
  treatmentDate?: { $gt?: number; $lte?: number };
  route?: ressourceFilterType['route'];
  importer?: ressourceFilterType['importer'];
  source?: ressourceFilterType['source'];
  jurisdiction?: ressourceFilterType['jurisdiction'];
  subAnnotationsSensitiveCount?: { $gt?: number };
  surAnnotationsCount?: { $gt?: number };
  'treatmentsSummary.userId'?: ressourceFilterType['userId'];
};

function buildRessourceFilterRequest(
  ressourceFilter: ressourceFilterType,
): ressourceFilterRequestType {
  const ressourceFilterRequest = {} as ressourceFilterRequestType;

  if (ressourceFilter.mustHaveSubAnnotations) {
    ressourceFilterRequest.subAnnotationsSensitiveCount = { $gt: 0 };
  }

  if (ressourceFilter.mustHaveSurAnnotations) {
    ressourceFilterRequest.surAnnotationsCount = { $gt: 0 };
  }

  if (ressourceFilter.publicationCategory) {
    ressourceFilterRequest.publicationCategory = [
      ressourceFilter.publicationCategory,
    ];
  }

  if (ressourceFilter.startDate) {
    ressourceFilterRequest.treatmentDate = {
      ...ressourceFilterRequest.treatmentDate,
      $gt: ressourceFilter.startDate,
    };
  }

  if (ressourceFilter.endDate) {
    ressourceFilterRequest.treatmentDate = {
      ...ressourceFilterRequest.treatmentDate,
      $lte: ressourceFilter.endDate,
    };
  }

  if (ressourceFilter.route) {
    ressourceFilterRequest.route = ressourceFilter.route;
  }

  if (ressourceFilter.importer) {
    ressourceFilterRequest.importer = ressourceFilter.importer;
  }

  if (ressourceFilter.source) {
    ressourceFilterRequest.source = ressourceFilter.source;
  }

  if (ressourceFilter.jurisdiction) {
    ressourceFilterRequest.jurisdiction = ressourceFilter.jurisdiction;
  }

  if (ressourceFilter.userId) {
    ressourceFilterRequest['treatmentsSummary.userId'] = ressourceFilter.userId;
  }

  return ressourceFilterRequest;
}
