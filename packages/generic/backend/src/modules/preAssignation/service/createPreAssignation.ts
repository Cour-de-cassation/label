import { preAssignationModule, idType } from '@label/core';
import { buildPreAssignationRepository } from '..';

export { createPreAssignation };

async function createPreAssignation({
  userId,
  source,
  documentNumber,
}: {
  userId: idType;
  source: string;
  documentNumber: number;
}) {
  const preAssignationRepository = buildPreAssignationRepository();

  const preAssignation = preAssignationModule.lib.buildPreAssignation({
    userId,
    source,
    documentNumber,
    creationDate: new Date().getTime(),
  });

  await preAssignationRepository.insert(preAssignation);

  return preAssignation;
}
