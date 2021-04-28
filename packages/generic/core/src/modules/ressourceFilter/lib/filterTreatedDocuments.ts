import { assignationType } from '../../assignation';
import { documentType } from '../../document';
import { idModule } from '../../id';
import { treatmentModule, treatmentType } from '../../treatment';
import { ressourceFilterType } from '../ressourceFilterType';

export { filterTreatedDocuments };

function filterTreatedDocuments({
  ressourceFilter,
  treatedDocuments,
}: {
  ressourceFilter: ressourceFilterType;
  treatedDocuments: Array<{
    assignations: assignationType[];
    document: documentType;
    treatments: treatmentType[];
  }>;
}) {
  return treatedDocuments.filter(({ assignations, document, treatments }) => {
    let isInTheFilter = true;
    const humanTreatments = treatmentModule.lib.sortInConsistentOrder(treatments).slice(2);

    if (ressourceFilter.mustHaveAddedAnnotations) {
      isInTheFilter = isInTheFilter && humanTreatments.some((treatment) => treatment.addedAnnotationsCount > 0);
    }

    if (ressourceFilter.mustHaveDeletedAnnotations) {
      isInTheFilter = isInTheFilter && humanTreatments.some((treatment) => treatment.deletedAnnotationsCount > 0);
    }

    if (ressourceFilter.mustHaveModifiedAnnotations) {
      isInTheFilter = isInTheFilter && humanTreatments.some((treatment) => treatment.modifiedAnnotationsCount > 0);
    }

    if (ressourceFilter.mustHaveNoModifications) {
      isInTheFilter =
        isInTheFilter &&
        humanTreatments.every(
          (treatment) => treatment.annotationsDiff.before.length === 0 && treatment.annotationsDiff.after.length === 0,
        );
    }

    if (ressourceFilter.mustHaveResizedBiggerAnnotations) {
      isInTheFilter = isInTheFilter && humanTreatments.some((treatment) => treatment.resizedBiggerAnnotationsCount > 0);
    }

    if (ressourceFilter.mustHaveResizedSmallerAnnotations) {
      isInTheFilter =
        isInTheFilter && humanTreatments.some((treatment) => treatment.resizedSmallerAnnotationsCount > 0);
    }

    if (ressourceFilter.publicationCategory) {
      isInTheFilter = isInTheFilter && document.publicationCategory.includes(ressourceFilter.publicationCategory);
    }

    if (ressourceFilter.source) {
      isInTheFilter = isInTheFilter && document.source === ressourceFilter.source;
    }

    if (ressourceFilter.userId) {
      const userIdToFilter = ressourceFilter.userId;

      isInTheFilter =
        isInTheFilter && assignations.some((assignation) => idModule.lib.equalId(assignation.userId, userIdToFilter));
    }

    return isInTheFilter;
  });
}
