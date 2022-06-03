import { documentType } from '../../document';
import { idModule } from '../../id';
import { treatmentType } from '../../treatment';
import { userType } from '../../user';
import { ressourceFilterType } from '../ressourceFilterType';

export { filterTreatedDocuments };

function filterTreatedDocuments({
  ressourceFilter,
  treatedDocuments,
}: {
  ressourceFilter: ressourceFilterType;
  treatedDocuments: Array<{
    document: documentType;
    treatments: treatmentType[];
    humanTreatments: Array<{ treatment: treatmentType; userId: userType['_id'] }>;
  }>;
}) {
  return treatedDocuments.filter(({ document, humanTreatments }) => {
    let isInTheFilter = true;

    if (ressourceFilter.mustHaveSurAnnotations) {
      isInTheFilter =
        isInTheFilter &&
        humanTreatments.some(({ treatment }) => {
          return treatment.surAnnotationsCount > 0;
        });
    }

    if (ressourceFilter.mustHaveSubAnnotations) {
      isInTheFilter =
        isInTheFilter &&
        humanTreatments.some(({ treatment }) => {
          return treatment.subAnnotationsSensitiveCount > 0;
        });
    }
    if (ressourceFilter.publicationCategory) {
      isInTheFilter = isInTheFilter && document.publicationCategory.includes(ressourceFilter.publicationCategory);
    }

    if (ressourceFilter.route) {
      isInTheFilter = isInTheFilter && document.route === ressourceFilter.route;
    }

    if (ressourceFilter.source) {
      isInTheFilter = isInTheFilter && document.source === ressourceFilter.source;
    }

    if (ressourceFilter.jurisdiction) {
      isInTheFilter = isInTheFilter && document.decisionMetadata.jurisdiction === ressourceFilter.jurisdiction;
    }

    if (ressourceFilter.startDate) {
      const { startDate } = ressourceFilter;
      isInTheFilter = isInTheFilter && humanTreatments.some(({ treatment }) => treatment.lastUpdateDate > startDate);
    }

    if (ressourceFilter.endDate) {
      const { endDate } = ressourceFilter;

      isInTheFilter = isInTheFilter && humanTreatments.some(({ treatment }) => treatment.lastUpdateDate < endDate);
    }

    if (ressourceFilter.userId) {
      const userIdToFilter = ressourceFilter.userId;

      isInTheFilter =
        isInTheFilter && humanTreatments.some(({ userId }) => idModule.lib.equalId(userId, userIdToFilter));
    }

    return isInTheFilter;
  });
}
