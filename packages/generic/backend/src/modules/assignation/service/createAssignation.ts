import {
  assignationModule,
  errorHandlers,
  idModule,
  idType,
} from '@label/core';
import { treatmentService } from '../../treatment';
import { userService } from '../../user';
import { buildAssignationRepository } from '../repository';

export { createAssignation };

async function createAssignation({
  userId,
  documentId,
}: {
  userId: idType;
  documentId: idType;
}) {
  const assignationRepository = buildAssignationRepository();

  const userRole = await userService.fetchUserRole(userId);

  if (userRole === 'publicator' || userRole === 'scrutator') {
    throw errorHandlers.serverErrorHandler.build(
      `User ${idModule.lib.convertToString(
        userId,
      )} is a ${userRole} and is trying to create an assignation`,
    );
  }

  const treatmentId = await treatmentService.createEmptyTreatment({
    documentId,
    source: userRole,
  });

  const assignation = assignationModule.lib.buildAssignation({
    userId,
    documentId,
    treatmentId,
  });

  await assignationRepository.insert(assignation);

  return assignation;
}
