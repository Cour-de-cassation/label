import { preAssignationModule, idType } from '@label/core';
import { buildPreAssignationRepository } from '..';

export { createPreAssignation };

async function createPreAssignation({
  userId,
  source,
  number,
}: {
  userId: idType;
  source: string;
  number: string;
}) {
  const preAssignationRepository = buildPreAssignationRepository();

  const preAssignation = preAssignationModule.lib.buildPreAssignation({
    userId,
    source,
    number,
    creationDate: new Date().getTime(),
  });

  await preAssignationRepository.insert(preAssignation);

  return preAssignation;
}
