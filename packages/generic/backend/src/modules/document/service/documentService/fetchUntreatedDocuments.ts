import { flatten } from 'lodash';
import { idModule } from '@label/core';
import { assignationService } from '../../../assignation';
import { userService } from '../../../user';
import { buildDocumentRepository } from '../../repository';

export { fetchUntreatedDocuments };

async function fetchUntreatedDocuments() {
  const documentRepository = buildDocumentRepository();
  const untreatedDocuments = await documentRepository.findAllByStatusProjection(
    ['free', 'pending', 'saved'],
    [
      '_id',
      'creationDate',
      'documentNumber',
      'publicationCategory',
      'source',
      'status',
    ],
  );
  const assignedDocumentIds = untreatedDocuments
    .filter(
      (document) =>
        document.status === 'pending' || document.status === 'saved',
    )
    .map((document) => document._id);
  const assignationsByDocumentId = await assignationService.fetchAssignationsByDocumentIds(
    assignedDocumentIds,
  );
  const allAssignations = flatten(Object.values(assignationsByDocumentId));
  const usersByAssignationId = await userService.fetchUsersByAssignations(
    allAssignations,
  );
  return untreatedDocuments.map((untreatedDocument) => {
    const assignationsForDocument =
      assignationsByDocumentId[
        idModule.lib.convertToString(untreatedDocument._id)
      ];
    const userNames = assignationsForDocument
      ? assignationsForDocument.map(
          (assignation) =>
            usersByAssignationId[idModule.lib.convertToString(assignation._id)]
              .name,
        )
      : [];

    return {
      document: {
        _id: untreatedDocument._id,
        creationDate: untreatedDocument.creationDate,
        publicationCategory: untreatedDocument.publicationCategory,
        documentNumber: untreatedDocument.documentNumber,
        source: untreatedDocument.source,
        status: untreatedDocument.status,
      },
      userNames,
    };
  });
}
