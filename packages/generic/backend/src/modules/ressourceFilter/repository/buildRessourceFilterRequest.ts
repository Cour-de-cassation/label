import { ressourceFilterType } from '@label/core';

export { buildRessourceFilterRequest };

type ressourceFilterRequestType = { userId: ressourceFilterType['userId'] };

function buildRessourceFilterRequest(
  ressourceFilter: ressourceFilterType,
): ressourceFilterRequestType {
  const ressourceFilterRequest = {} as ressourceFilterRequestType;

  if (ressourceFilter.userId) {
    ressourceFilterRequest.userId = ressourceFilter.userId;
  }

  return ressourceFilterRequest;
}
