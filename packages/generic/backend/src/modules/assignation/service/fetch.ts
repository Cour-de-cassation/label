import { assignationType, idModule, idType, indexer } from '@label/core';
import { buildAssignationRepository } from '../repository';

export {
  fetchAllAssignationsById,
  fetchAssignationId,
  fetchAssignationsByDocumentIds,
  fetchAssignationsOfDocumentId,
  fetchDocumentIdsAssignatedToUserId,
};

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

async function fetchAssignationsByDocumentIds(documentIdsToSearchIn: idType[]) {
  const assignationRepository = buildAssignationRepository();

  const assignationsByDocumentIds = await assignationRepository.findAllByDocumentIds(
    documentIdsToSearchIn,
  );

  indexer.assertEveryIdIsDefined(
    documentIdsToSearchIn.map(idModule.lib.convertToString),
    assignationsByDocumentIds,
    (_id) => `The document ${_id} has no matching assignations`,
  );
  return assignationsByDocumentIds;
}

async function fetchAssignationsOfDocumentId(
  documentId: idType,
): Promise<assignationType[]> {
  const assignationRepository = buildAssignationRepository();

  return assignationRepository.findAllByDocumentId(documentId);
}

async function fetchDocumentIdsAssignatedToUserId(userId: idType) {
  const assignationRepository = buildAssignationRepository();
  const assignations = await assignationRepository.findAllByUserId(userId);

  return assignations.map((assignation) => assignation.documentId);
}
