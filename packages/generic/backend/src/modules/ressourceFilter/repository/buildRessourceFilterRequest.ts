import { ressourceFilterType } from '@label/core';

export { buildRessourceFilterRequest };

type ressourceFilterRequestType = {
  publicationCategory: string[];
  source: ressourceFilterType['source'];
  userId: ressourceFilterType['userId'];
};

function buildRessourceFilterRequest(
  ressourceFilter: ressourceFilterType,
): ressourceFilterRequestType {
  const ressourceFilterRequest = {} as ressourceFilterRequestType;

  if (ressourceFilter.publicationCategory) {
    ressourceFilterRequest.publicationCategory = [
      ressourceFilter.publicationCategory,
    ];
  }

  if (ressourceFilter.source) {
    ressourceFilterRequest.source = ressourceFilter.source;
  }

  if (ressourceFilter.userId) {
    ressourceFilterRequest.userId = ressourceFilter.userId;
  }

  return ressourceFilterRequest;
}
