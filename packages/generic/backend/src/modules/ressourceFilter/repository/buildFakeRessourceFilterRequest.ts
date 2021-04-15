import { idModule, idType, ressourceFilterType } from '@label/core';

export { buildFakeRessourceFilterRequest };

function buildFakeRessourceFilterRequest(ressourceFilter: ressourceFilterType) {
  return (item: { userId: idType }) => {
    let isValidAccordingToFilter = true;

    if (ressourceFilter.userId) {
      isValidAccordingToFilter =
        isValidAccordingToFilter &&
        idModule.lib.equalId(item.userId, ressourceFilter.userId);
    }

    return isValidAccordingToFilter;
  };
}
