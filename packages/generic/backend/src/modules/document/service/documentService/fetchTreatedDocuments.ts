import { sumBy } from 'lodash';
import {
  errorHandlers,
  idModule,
  settingsType,
  statisticModule,
  treatmentModule,
} from '@label/core';
import { assignationService } from '../../../assignation';
import { treatmentService } from '../../../treatment';
import { userService } from '../../../user';
import { buildDocumentRepository } from '../../repository';

export { fetchTreatedDocuments };

async function fetchTreatedDocuments(settings: settingsType) {
  const documentRepository = buildDocumentRepository();

  const treatedDocuments = await documentRepository.findAllByStatusProjection(
    ['done', 'toBePublished'],
    ['_id', 'documentNumber', 'publicationCategory', 'reviewStatus', 'source'],
  );

  const documentIds = treatedDocuments.map(({ _id }) => _id);
  const assignationsByDocumentId = await assignationService.fetchAssignationsByDocumentIds(
    documentIds,
  );

  const usersByIds = await userService.fetchUsers();
  const treatmentsByDocumentId = await treatmentService.fetchTreatmentsByDocumentIds(
    documentIds,
  );

  return treatedDocuments.map((treatedDocument) => {
    const documentIdString = idModule.lib.convertToString(treatedDocument._id);
    const assignations = assignationsByDocumentId[documentIdString];

    const treatments = treatmentsByDocumentId[documentIdString];
    const humanTreatments = treatmentModule.lib.extractHumanTreatments(
      treatments,
      assignations,
    );
    if (humanTreatments.length === 0) {
      throw errorHandlers.serverErrorHandler.build(
        `No human treatment found for document ${documentIdString}`,
      );
    }
    const userNames = humanTreatments.map(
      ({ userId }) => usersByIds[idModule.lib.convertToString(userId)].name,
    );
    const totalTreatmentDuration = sumBy(
      humanTreatments,
      ({ treatment }) => treatment.duration,
    );
    const lastTreatmentDate =
      humanTreatments[humanTreatments.length - 1].treatment.lastUpdateDate;
    const statistic = statisticModule.lib.simplify(
      treatmentModule.lib.aggregate(
        humanTreatments.map(({ treatment }) => treatment),
        'annotator',
        settings,
      ),
    );
    return {
      document: {
        _id: treatedDocument._id,
        documentNumber: treatedDocument.documentNumber,
        publicationCategory: treatedDocument.publicationCategory,
        reviewStatus: treatedDocument.reviewStatus,
        source: treatedDocument.source,
      },
      totalTreatmentDuration,
      lastTreatmentDate,
      statistic,
      userNames,
    };
  });
}
