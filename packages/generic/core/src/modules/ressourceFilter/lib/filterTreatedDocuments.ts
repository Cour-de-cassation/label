import { assignationType } from '../../assignation';
import { documentType } from '../../document';
import { idModule } from '../../id';
import { treatmentType } from '../../treatment';
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
  return treatedDocuments.filter(({ assignations, document }) => {
    let isInTheFilter = true;

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
