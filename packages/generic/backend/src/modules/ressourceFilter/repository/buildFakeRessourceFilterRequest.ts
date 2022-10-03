import { idModule, ressourceFilterType, statisticType } from '@label/core';

export { buildFakeRessourceFilterRequest };

function buildFakeRessourceFilterRequest(ressourceFilter: ressourceFilterType) {
  return (item: {
    jurisdiction: statisticType['jurisdiction'];
    publicationCategory: statisticType['publicationCategory'];
    route: statisticType['route'];
    source: statisticType['source'];
    treatmentDate: statisticType['treatmentDate'];
    treatmentsSummary: statisticType['treatmentsSummary'];
    subAnnotationsSensitiveCount: statisticType['subAnnotationsSensitiveCount'];
    subAnnotationsNonSensitiveCount: statisticType['subAnnotationsNonSensitiveCount'];
    surAnnotationsCount: statisticType['surAnnotationsCount'];
  }) => {
    let isValidAccordingToFilter = true;

    if (ressourceFilter.mustHaveSubAnnotations) {
      isValidAccordingToFilter =
        isValidAccordingToFilter && item.subAnnotationsSensitiveCount > 0;
    }

    if (ressourceFilter.mustHaveSurAnnotations) {
      isValidAccordingToFilter =
        isValidAccordingToFilter && item.surAnnotationsCount > 0;
    }

    if (ressourceFilter.publicationCategory) {
      isValidAccordingToFilter =
        isValidAccordingToFilter &&
        item.publicationCategory.includes(ressourceFilter.publicationCategory);
    }

    if (ressourceFilter.startDate) {
      isValidAccordingToFilter =
        isValidAccordingToFilter &&
        item.treatmentDate > ressourceFilter.startDate;
    }

    if (ressourceFilter.endDate) {
      isValidAccordingToFilter =
        isValidAccordingToFilter &&
        item.treatmentDate < ressourceFilter.endDate;
    }

    if (ressourceFilter.route) {
      isValidAccordingToFilter =
        isValidAccordingToFilter && item.route === ressourceFilter.route;
    }

    if (ressourceFilter.source) {
      isValidAccordingToFilter =
        isValidAccordingToFilter && item.source === ressourceFilter.source;
    }

    if (ressourceFilter.jurisdiction) {
      isValidAccordingToFilter =
        isValidAccordingToFilter &&
        item.jurisdiction === ressourceFilter.jurisdiction;
    }

    if (ressourceFilter.userId) {
      const { userId: userIdToFilter } = ressourceFilter;
      isValidAccordingToFilter =
        isValidAccordingToFilter &&
        item.treatmentsSummary.some(({ userId }) =>
          idModule.lib.equalId(userId, userIdToFilter),
        );
    }

    return isValidAccordingToFilter;
  };
}
