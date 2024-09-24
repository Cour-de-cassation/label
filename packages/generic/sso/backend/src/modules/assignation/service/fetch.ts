import {
  assignationType,
  documentType,
  idModule,
  idType,
  indexer,
  userType,
} from '@label/core';
import { buildAssignationRepository } from '../repository';

export {
  fetchAllAssignationsById,
  fetchAssignation,
  fetchAssignationId,
  fetchAssignationsByDocumentIds,
  fetchAssignationsOfDocumentId,
  fetchDocumentIdsAssignatedToUserId,
};

async function fetchAssignation(assignationId: assignationType['_id']) {
  const assignationRepository = buildAssignationRepository();

  return assignationRepository.findById(assignationId);
}

async function fetchAllAssignationsById(
  assignationIds?: assignationType['_id'][],
) {
  const assignationRepository = buildAssignationRepository();

  const assignationsById = await assignationRepository.findAllByIds(
    assignationIds,
  );

  if (assignationIds) {
    indexer.assertEveryIdIsDefined(
      assignationIds.map((assignationId) =>
        idModule.lib.convertToString(assignationId),
      ),
      assignationsById,
      (_id) => `The assignation id ${_id} has no matching assignation`,
    );
  }

  return assignationsById;
}

async function fetchAssignationId({
  userId,
  documentId,
}: {
  userId: idType;
  documentId: idType;
}) {
  const assignationRepository = buildAssignationRepository();
  const assignations = await assignationRepository.findAllByUserId(userId);
  const assignation = assignations.find((assignation) =>
    idModule.lib.equalId(assignation.documentId, documentId),
  );

  return assignation?._id;
}

async function fetchAssignationsByDocumentIds(
  documentIdsToSearchIn: idType[],
  options: { assertEveryDocumentIsAssigned: boolean },
) {
  const assignationRepository = buildAssignationRepository();

  const assignationsByDocumentIds = await assignationRepository.findAllByDocumentIds(
    documentIdsToSearchIn,
  );

  if (options?.assertEveryDocumentIsAssigned) {
    indexer.assertEveryIdIsDefined(
      documentIdsToSearchIn.map(idModule.lib.convertToString),
      assignationsByDocumentIds,
      (_id) => `The document ${_id} has no matching assignations`,
    );
  }
  return assignationsByDocumentIds;
}

async function fetchAssignationsOfDocumentId(
  documentId: idType,
): Promise<assignationType[]> {
  const assignationRepository = buildAssignationRepository();

  return assignationRepository.findAllByDocumentId(documentId);
}

async function fetchDocumentIdsAssignatedToUserId(
  userId: userType['_id'],
): Promise<
  Array<{
    documentId: documentType['_id'];
    assignationId: assignationType['_id'];
  }>
> {
  const assignationRepository = buildAssignationRepository();
  const assignations = await assignationRepository.findAllByUserId(userId);

  return assignations.map((assignation) => ({
    documentId: assignation.documentId as documentType['_id'],
    assignationId: assignation._id as assignationType['_id'],
  }));
}
