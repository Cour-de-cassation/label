import { assignationType, idModule, idType } from '@label/core';
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

  return assignationRepository.findAllByIds(assignationIds);
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

  return assignationRepository.findAllByDocumentIds(documentIdsToSearchIn);
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
