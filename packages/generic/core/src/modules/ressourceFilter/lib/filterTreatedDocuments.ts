import { assignationType } from '../../assignation';
import { documentType } from '../../document';
import { idModule } from '../../id';
import { treatmentModule, treatmentType } from '../../treatment';
import { statisticModule } from '../../statistic';
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

    if (ressourceFilter.mustHaveSurAnnotations) {
      isInTheFilter =
        isInTheFilter &&
        humanTreatments.some((treatment) => {
          const simplifyedStatistic = statisticModule.lib.simplify(treatment);
          return simplifyedStatistic.surAnnotationsCompleteCount + simplifyedStatistic.surAnnotationsPartialCount > 0;
        });
    }

    if (ressourceFilter.mustHaveSubAnnotations) {
      isInTheFilter =
        isInTheFilter &&
        humanTreatments.some((treatment) => {
          const simplifyedStatistic = statisticModule.lib.simplify(treatment);
          return simplifyedStatistic.subAnnotationsCompleteCount + simplifyedStatistic.subAnnotationsPartialCount > 0;
        });
    }
    if (ressourceFilter.publicationCategory) {
      isInTheFilter = isInTheFilter && document.publicationCategory.includes(ressourceFilter.publicationCategory);
    }

    if (ressourceFilter.source) {
      isInTheFilter = isInTheFilter && document.source === ressourceFilter.source;
    }

    if (ressourceFilter.startDate) {
      const { startDate } = ressourceFilter;
      isInTheFilter = isInTheFilter && humanTreatments.some((treatment) => treatment.lastUpdateDate > startDate);
    }

    if (ressourceFilter.endDate) {
      const { endDate } = ressourceFilter;

      isInTheFilter = isInTheFilter && humanTreatments.some((treatment) => treatment.lastUpdateDate < endDate);
    }

    if (ressourceFilter.userId) {
      const userIdToFilter = ressourceFilter.userId;

      isInTheFilter =
        isInTheFilter && assignations.some((assignation) => idModule.lib.equalId(assignation.userId, userIdToFilter));
    }

    return isInTheFilter;
  });
}
