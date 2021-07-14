import { idModule, idType, ressourceFilterType } from '@label/core';

export { buildFakeRessourceFilterRequest };

function buildFakeRessourceFilterRequest(ressourceFilter: ressourceFilterType) {
  return (item: {
    addedAnnotationsCount: { sensitive: number; other: number };
    deletedAnnotationsCount: { anonymised: number; other: number };
    modifiedAnnotationsCount: {
      nonAnonymisedToSensitive: number;
      anonymisedToNonAnonymised: number;
      other: number;
    };
    publicationCategory: string[];
    resizedBiggerAnnotationsCount: { sensitive: number; other: number };
    resizedSmallerAnnotationsCount: { anonymised: number; other: number };
    source: string;
    userId: idType;
  }) => {
    let isValidAccordingToFilter = true;

    if (ressourceFilter.mustHaveSubAnnotations) {
      isValidAccordingToFilter =
        isValidAccordingToFilter &&
        (item.addedAnnotationsCount.sensitive > 0 ||
          item.modifiedAnnotationsCount.nonAnonymisedToSensitive > 0 ||
          item.resizedBiggerAnnotationsCount.sensitive > 0);
    }

    if (ressourceFilter.mustHaveSurAnnotations) {
      isValidAccordingToFilter =
        isValidAccordingToFilter &&
        (item.deletedAnnotationsCount.anonymised > 0 ||
          item.modifiedAnnotationsCount.anonymisedToNonAnonymised > 0 ||
          item.resizedSmallerAnnotationsCount.anonymised > 0);
    }

    if (ressourceFilter.publicationCategory) {
      isValidAccordingToFilter =
        isValidAccordingToFilter &&
        item.publicationCategory.includes(ressourceFilter.publicationCategory);
    }

    if (ressourceFilter.source) {
      isValidAccordingToFilter =
        isValidAccordingToFilter && item.source === ressourceFilter.source;
    }

    if (ressourceFilter.userId) {
      isValidAccordingToFilter =
        isValidAccordingToFilter &&
        idModule.lib.equalId(item.userId, ressourceFilter.userId);
    }

    return isValidAccordingToFilter;
  };
}
