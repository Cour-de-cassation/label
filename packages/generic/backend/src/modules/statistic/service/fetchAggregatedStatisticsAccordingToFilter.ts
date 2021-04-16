import { flatten } from 'lodash';
import {
  idModule,
  ressourceFilterType,
  statisticModule,
  statisticsCreator,
} from '@label/core';
import { assignationService } from '../../assignation';
import { documentService } from '../../document';
import { treatmentService } from '../../treatment';
import { buildStatisticRepository } from '../repository';

export { fetchAggregatedStatisticsAccordingToFilter };

async function fetchAggregatedStatisticsAccordingToFilter(
  filter: ressourceFilterType,
) {
  const statisticRepository = buildStatisticRepository();

  const statistics = await statisticRepository.findAllByRessourceFilter(filter);

  const doneDocumentStatistics = await computeStatisticsFromDoneDocuments();

  return statisticModule.lib.aggregate([
    ...statistics,
    ...doneDocumentStatistics,
  ]);

  async function computeStatisticsFromDoneDocuments() {
    const doneDocuments = await documentService.fetchDoneDocuments();
    const documentIds = doneDocuments.map(({ _id }) => _id);

    const assignationsByDocumentId = await assignationService.fetchAssignationsByDocumentIds(
      documentIds,
    );
    const treatmentsByDocumentId = await treatmentService.fetchTreatmentsByDocumentIds(
      documentIds,
    );

    const treatedDocuments = doneDocuments.map((document) => ({
      assignations: [
        assignationsByDocumentId[idModule.lib.convertToString(document._id)],
      ],
      document,
      treatments:
        treatmentsByDocumentId[idModule.lib.convertToString(document._id)],
    }));

    const filteredTreatedDocuments = treatedDocuments.filter(
      ({ assignations }) => {
        let isInTheFilter = true;

        if (filter.userId) {
          const userIdToFilter = filter.userId;

          isInTheFilter =
            isInTheFilter &&
            assignations.some((assignation) =>
              idModule.lib.equalId(assignation.userId, userIdToFilter),
            );
        }

        return isInTheFilter;
      },
    );

    return flatten(
      filteredTreatedDocuments.map(({ assignations, document, treatments }) =>
        statisticsCreator.buildFromDocument({
          assignations,
          document,
          treatments,
        }),
      ),
    );
  }
}
