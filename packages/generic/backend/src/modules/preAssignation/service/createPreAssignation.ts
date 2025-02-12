import { preAssignationModule, idType } from '@label/core';
import { buildPreAssignationRepository } from '..';

export { createPreAssignation };

async function createPreAssignation({
  userId,
  source,
  number,
  publicationDate,
}: {
  userId: idType;
  source: string;
  number: string;
  publicationDate: number;
}) {
  const preAssignationRepository = buildPreAssignationRepository();

  const preAssignation = preAssignationModule.lib.buildPreAssignation({
    userId,
    source,
    number,
    publicationDate,
    creationDate: new Date().getTime(),
  });

  await preAssignationRepository.insert(preAssignation);

  return preAssignation;
}
