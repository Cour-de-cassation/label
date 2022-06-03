import { flatten } from 'lodash';
import {
  assignationType,
  idModule,
  ressourceFilterModule,
  ressourceFilterType,
  settingsType,
  statisticModule,
  statisticsCreator,
  treatmentModule,
} from '@label/core';
import { assignationService } from '../../assignation';
import { documentService } from '../../document';
import { treatmentService } from '../../treatment';
import { buildStatisticRepository } from '../repository';

export { fetchAggregatedStatisticsAccordingToFilter };

async function fetchAggregatedStatisticsAccordingToFilter(
  filter: ressourceFilterType,
  settings: settingsType,
) {
  const statisticRepository = buildStatisticRepository();

  const statistics = await statisticRepository.findAllByRessourceFilter(filter);
  const doneDocumentStatistics = await computeStatisticsFromDoneDocuments();
  return statisticModule.lib.aggregate(
    [...statistics, ...doneDocumentStatistics],
    filter,
  );

  async function computeStatisticsFromDoneDocuments() {
    const doneDocuments = await documentService.fetchDoneDocuments();
    const documentIds = doneDocuments.map(({ _id }) => _id);

    const assignationsByDocumentId: Record<
      string,
      assignationType[] | undefined
    > = await assignationService.fetchAssignationsByDocumentIds(documentIds, {
      assertEveryDocumentIsAssigned: false,
    });
    const treatmentsByDocumentId = await treatmentService.fetchTreatmentsByDocumentIds(
      documentIds,
    );

    const treatedDocuments = doneDocuments.map((document) => {
      const assignations =
        assignationsByDocumentId[idModule.lib.convertToString(document._id)];
      const treatments =
        treatmentsByDocumentId[idModule.lib.convertToString(document._id)];
      const humanTreatments = assignations
        ? treatmentModule.lib.extractHumanTreatments(treatments, assignations)
        : [];

      return {
        document,
        treatments,
        humanTreatments,
      };
    });

    const filteredTreatedDocuments = ressourceFilterModule.lib.filterTreatedDocuments(
      {
        ressourceFilter: filter,
        treatedDocuments,
      },
    );

    return flatten(
      filteredTreatedDocuments.map(
        ({ document, treatments, humanTreatments }) =>
          statisticsCreator.buildFromDocument({
            humanTreatments,
            document,
            treatments,
            settings,
          }),
      ),
    );
  }
}
