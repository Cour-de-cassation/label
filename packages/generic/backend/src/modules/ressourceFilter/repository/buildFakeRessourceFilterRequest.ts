import { idModule, idType, ressourceFilterType } from '@label/core';

export { buildFakeRessourceFilterRequest };

function buildFakeRessourceFilterRequest(ressourceFilter: ressourceFilterType) {
  return (item: {
    addedAnnotationsCount: { sensitive: number; other: number };
    deletedAnnotationsCount: { anonymised: number; other: number };
    modifiedAnnotationsCount: number;
    publicationCategory: string[];
    resizedBiggerAnnotationsCount: number;
    resizedSmallerAnnotationsCount: number;
    source: string;
    userId: idType;
  }) => {
    let isValidAccordingToFilter = true;

    if (ressourceFilter.mustHaveAddedAnnotations) {
      isValidAccordingToFilter =
        isValidAccordingToFilter && item.addedAnnotationsCount.sensitive > 0;
    }

    if (ressourceFilter.mustHaveDeletedAnnotations) {
      isValidAccordingToFilter =
        isValidAccordingToFilter && item.deletedAnnotationsCount.anonymised > 0;
    }

    if (ressourceFilter.mustHaveModifiedAnnotations) {
      isValidAccordingToFilter =
        isValidAccordingToFilter && item.modifiedAnnotationsCount > 0;
    }

    if (ressourceFilter.mustHaveNoModifications) {
      isValidAccordingToFilter =
        isValidAccordingToFilter &&
        item.addedAnnotationsCount.sensitive === 0 &&
        item.addedAnnotationsCount.other === 0 &&
        item.deletedAnnotationsCount.anonymised === 0 &&
        item.deletedAnnotationsCount.other === 0 &&
        item.modifiedAnnotationsCount === 0 &&
        item.resizedBiggerAnnotationsCount === 0 &&
        item.resizedSmallerAnnotationsCount === 0;
    }

    if (ressourceFilter.mustHaveResizedBiggerAnnotations) {
      isValidAccordingToFilter =
        isValidAccordingToFilter && item.resizedBiggerAnnotationsCount > 0;
    }

    if (ressourceFilter.mustHaveResizedSmallerAnnotations) {
      isValidAccordingToFilter =
        isValidAccordingToFilter && item.resizedSmallerAnnotationsCount > 0;
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
