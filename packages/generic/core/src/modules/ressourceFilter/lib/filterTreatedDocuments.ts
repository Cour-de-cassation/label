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
    const sortedTreatments = treatmentModule.lib.sortInConsistentOrder(treatments);

    if (ressourceFilter.mustHaveAddedAnnotations) {
      isInTheFilter =
        isInTheFilter && sortedTreatments.slice(2).some((treatment) => treatment.addedAnnotationsCount > 0);
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
